<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Resources\EnquiryResource;
use App\Http\Resources\SellRequestResource;
use App\Http\Resources\UserResource;
use App\Http\Responses\ApiResponse;
use App\Models\User;
use Illuminate\Http\Request;

class UserAdminController extends Controller
{
    use ApiResponse;

    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $query = User::query()
            ->with('roles')
            ->withTrashed()
            ->when($request->filled('q'), fn ($q) => $q->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->string('q').'%')
                    ->orWhere('email', 'like', '%'.$request->string('q').'%')
                    ->orWhere('phone', 'like', '%'.$request->string('q').'%');
            }))
            ->when($request->filled('role'), fn ($q) => $q->whereHas('roles', fn ($r) => $r->where('slug', $request->string('role'))))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')));

        // Sort: admins first keeps the dashboard tidy.
        $query->withCount('roles')->orderByDesc('roles_count')->orderBy('created_at', 'desc');

        $users = $query->paginate($request->integer('per_page', 15));

        return $this->success([
            'users' => UserResource::collection($users->items()),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ], 'Users retrieved successfully');
    }

    public function show(User $user): \Illuminate\Http\JsonResponse
    {
        $user->load(['roles']);

        $enquiries = $user->enquiries()->with('listing:id,title,slug')->latest()->limit(10)->get();
        $sellRequests = $user->sellRequests()->with('images')->latest()->limit(10)->get();
        $favorites = $user->favorites()->with('listing:id,title,slug,price,currency')->latest()->limit(10)->get();

        return $this->success([
            'user' => new UserResource($user),
            'enquiries' => EnquiryResource::collection($enquiries),
            'sell_requests' => SellRequestResource::collection($sellRequests),
            'favorites' => $favorites->map(fn ($f) => [
                'id' => $f->id,
                'created_at' => $f->created_at,
                'listing' => $f->listing ? [
                    'id' => $f->listing->id,
                    'title' => $f->listing->title,
                    'slug' => $f->listing->slug,
                    'price' => $f->listing->price,
                    'currency' => $f->listing->currency,
                ] : null,
            ])->values(),
        ], 'User details retrieved successfully');
    }

    public function update(UpdateUserRequest $request, User $user): \Illuminate\Http\JsonResponse
    {
        if ($user->id === $request->user()->id && $user->isSuperAdmin() && $request->input('status') === 'disabled') {
            return $this->error('You cannot disable your own account.', 422);
        }

        $user->update($request->safe()->except('roles'));

        if ($request->filled('roles')) {
            $roleIds = \App\Models\Role::whereIn('slug', $request->input('roles'))->pluck('id');
            $user->roles()->sync($roleIds);
        }

        return $this->success(new UserResource($user->load('roles')), 'User updated successfully');
    }

    public function toggleStatus(Request $request, User $user): \Illuminate\Http\JsonResponse
    {
        if ($user->id === $request->user()->id) {
            return $this->error('You cannot disable your own account.', 422);
        }

        $newStatus = $user->status === 'active' ? 'disabled' : 'active';
        $user->update(['status' => $newStatus]);

        return $this->success(['status' => $newStatus], 'User status updated successfully');
    }
}