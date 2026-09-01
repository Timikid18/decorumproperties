<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Http\Responses\ApiResponse;
use App\Models\User;
use App\Services\FileUploadService;
use App\Support\Roles;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    use ApiResponse;

    public function register(RegisterRequest $request): \Illuminate\Http\JsonResponse
    {
        $user = User::create($request->safe()->except('password') + [
            'password' => $request->string('password'),
            'status' => 'active',
        ]);
        $user->assignRole(Roles::CUSTOMER);

        $token = $user->createToken('decorum-web')->plainTextToken;

        return $this->created([
            'token' => $token,
            'user' => new UserResource($user->load('roles')),
        ], 'Account created successfully');
    }

    public function login(LoginRequest $request): \Illuminate\Http\JsonResponse
    {
        $user = User::where('email', $request->string('email'))->first();

        if (! $user || ! Hash::check($request->string('password'), $user->password)) {
            return $this->error('Invalid credentials. Please check your email and password.', 401);
        }

        if ($user->status !== 'active') {
            return $this->error('This account has been disabled. Please contact support.', 403);
        }

        $token = $user->createToken($request->input('device_name', 'decorum-web'))->plainTextToken;

        return $this->success([
            'token' => $token,
            'user' => new UserResource($user->load('roles')),
        ], 'Login successful');
    }

    public function logout(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 'Logged out successfully');
    }

    public function me(Request $request): \Illuminate\Http\JsonResponse
    {
        return $this->success(new UserResource($request->user()->load('roles')), 'Profile retrieved successfully');
    }

    public function updateProfile(UpdateProfileRequest $request, FileUploadService $files): \Illuminate\Http\JsonResponse
    {
        $user = $request->user();
        $data = $request->safe()->except('avatar');

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                $files->deleteImage($user->avatar);
            }
            $data['avatar'] = $files->storeImage($request->file('avatar'), 'avatars')['path'];
        }

        $user->update($data);

        return $this->success(new UserResource($user->load('roles')), 'Profile updated successfully');
    }

    public function updatePassword(Request $request): \Illuminate\Http\JsonResponse
    {
        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::min(8)->letters()->numbers()],
        ]);

        $user = $request->user();

        if (! Hash::check($data['current_password'], $user->password)) {
            return $this->error('Your current password is incorrect.', 422);
        }

        $user->update(['password' => $data['password']]);

        return $this->success(null, 'Password updated successfully');
    }

    public function forgotPassword(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
        ]);

        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? $this->success(null, 'If that email exists, a reset link has been sent.')
            : $this->error('Unable to send reset link.', 400);
    }

    public function resetPassword(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::min(8)->letters()->numbers()],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? $this->success(null, 'Password reset successfully. You can now log in.')
            : $this->error('This reset token is invalid or has expired.', 400);
    }
}