<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ListingResource;
use App\Http\Responses\ApiResponse;
use App\Services\ListingService;
use Illuminate\Http\Request;

class DirectoryController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected ListingService $listings,
    ) {}

    public function properties(Request $request): \Illuminate\Http\JsonResponse
    {
        $paginator = $this->listings->properties($request);

        return $this->success($this->payload($paginator), 'Properties retrieved successfully');
    }

    public function lands(Request $request): \Illuminate\Http\JsonResponse
    {
        $paginator = $this->listings->properties($request, 'land');

        return $this->success($this->payload($paginator), 'Lands retrieved successfully');
    }

    public function vehicles(Request $request): \Illuminate\Http\JsonResponse
    {
        $paginator = $this->listings->vehicles($request);

        return $this->success($this->payload($paginator), 'Vehicles retrieved successfully');
    }

    public function shop(Request $request): \Illuminate\Http\JsonResponse
    {
        $paginator = $this->listings->shop($request);

        return $this->success($this->payload($paginator), 'Shop items retrieved successfully');
    }

    /** @return array{listings: mixed, pagination: array<string, mixed>} */
    protected function payload($paginator): array
    {
        return [
            'listings' => ListingResource::collection($paginator->items()),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
        ];
    }
}