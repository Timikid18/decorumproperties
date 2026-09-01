<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EnquiryResource;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;

class MyAccountController extends Controller
{
    use ApiResponse;

    public function enquiries(Request $request): \Illuminate\Http\JsonResponse
    {
        $enquiries = $request->user()->enquiries()
            ->with(['listing:id,title,slug'])
            ->latest()
            ->paginate(15);

        return $this->success([
            'enquiries' => EnquiryResource::collection($enquiries->items()),
            'pagination' => [
                'current_page' => $enquiries->currentPage(),
                'last_page' => $enquiries->lastPage(),
                'per_page' => $enquiries->perPage(),
                'total' => $enquiries->total(),
            ],
        ], 'Your enquiries retrieved successfully');
    }
}