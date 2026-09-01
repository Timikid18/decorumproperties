<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ListingDetailResource;
use App\Http\Resources\ListingResource;
use App\Http\Responses\ApiResponse;
use App\Services\ListingService;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected ListingService $listings,
    ) {}

    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $query = $this->listings->publishedQuery();
        $query = $this->listings->applyPublicFilters($query, $request);
        $query = $this->listings->applySort($query, $request->input('sort'));
        $paginator = $this->listings->paginate($query, $request);

        return $this->success([
            'listings' => ListingResource::collection($paginator->items()),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
        ], 'Listings retrieved successfully');
    }

    public function show(Request $request, string $slug): \Illuminate\Http\JsonResponse
    {
        $listing = $this->listings->findPublishedBySlug($slug);

        if (! $listing) {
            return $this->error('Listing not found.', 404);
        }

        $listing->loadCount(['favorites']);
        $this->listings->incrementViews($listing);

        $resource = new ListingDetailResource($listing->load([
            'category.group',
            'images',
            'features',
            'specifications',
            'property',
            'automobile',
            'favorites' => fn ($q) => $q->where('user_id', auth('sanctum')->id()),
        ]));

        return $this->success($resource, 'Listing retrieved successfully');
    }

    public function featured(Request $request): \Illuminate\Http\JsonResponse
    {
        $limit = min((int) $request->input('limit', 8), 24);

        return $this->success(
            ListingResource::collection($this->listings->featured($limit)),
            'Featured listings retrieved successfully'
        );
    }

    public function latest(Request $request): \Illuminate\Http\JsonResponse
    {
        $limit = min((int) $request->input('limit', 12), 30);

        return $this->success(
            ListingResource::collection($this->listings->latest($limit)),
            'Latest listings retrieved successfully'
        );
    }

    public function search(Request $request): \Illuminate\Http\JsonResponse
    {
        $paginator = $this->listings->search($request);

        return $this->success([
            'listings' => ListingResource::collection($paginator->items()),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
        ], 'Search results retrieved successfully');
    }
}