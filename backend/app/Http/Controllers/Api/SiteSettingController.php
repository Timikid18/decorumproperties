<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\SiteSettingsService;

class SiteSettingController extends Controller
{
    use ApiResponse;

    public function index(SiteSettingsService $settings): \Illuminate\Http\JsonResponse
    {
        return $this->success($settings->publicSettings(), 'Site settings retrieved successfully');
    }
}