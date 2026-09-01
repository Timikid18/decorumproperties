<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SettingsUpdateRequest;
use App\Http\Responses\ApiResponse;
use App\Models\SiteSetting;
use App\Services\FileUploadService;

class SettingsAdminController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected FileUploadService $files,
    ) {}

    public function index(): \Illuminate\Http\JsonResponse
    {
        $settings = SiteSetting::query()->orderBy('group')->orderBy('key')->get();

        return $this->success($settings->map(fn (SiteSetting $s) => [
            'key' => $s->key,
            'value' => $s->value,
            'group' => $s->group,
            'is_public' => $s->is_public,
        ]), 'Settings retrieved successfully');
    }

    public function update(SettingsUpdateRequest $request): \Illuminate\Http\JsonResponse
    {
        foreach ($request->input('settings', []) as $setting) {
            if ($setting['key'] === 'logo' || $setting['key'] === 'favicon') {
                continue; // handled by dedicated upload endpoints
            }
            SiteSetting::updateOrCreate(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'group' => $setting['group'] ?? 'general',
                ]
            );
        }

        return $this->success(null, 'Settings updated successfully');
    }

    public function uploadLogo(\Illuminate\Http\Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'file' => ['required', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:3072'],
        ]);

        return $this->storeImage('logo', $request->file('file'), 'brand');
    }

    public function uploadFavicon(\Illuminate\Http\Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'file' => ['required', 'image', 'mimes:ico,png,jpg,jpeg,webp', 'max:1024'],
        ]);

        return $this->storeImage('favicon', $request->file('file'), 'brand');
    }

    protected function storeImage(string $key, \Illuminate\Http\UploadedFile $file, string $directory): \Illuminate\Http\JsonResponse
    {
        $current = SiteSetting::where('key', $key)->value('value');
        if ($current) {
            $this->files->deleteImage($current);
        }

        $stored = $this->files->storeImage($file, $directory);

        SiteSetting::updateOrCreate(['key' => $key], [
            'value' => $stored['path'],
            'group' => 'brand',
            'is_public' => true,
        ]);

        return $this->success(['key' => $key, 'url' => $stored['url']], 'Image uploaded successfully');
    }
}