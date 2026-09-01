<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Favorite;
use App\Models\Listing;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    use ApiResponse;

    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $favorites = $request->user()->favorites()
            ->with('listing.category', 'listing.images')
            ->latest()
            ->paginate(12);

        return $this->success([
            'favorites' => $favorites->map(fn (Favorite $f) => [
                'id' => $f->id,
                'created_at' => $f->created_at,
                'listing' => new \App\Http\Resources\ListingResource($f->listing),
            ]),
            'pagination' => [
                'current_page' => $favorites->currentPage(),
                'last_page' => $favorites->lastPage(),
                'per_page' => $favorites->perPage(),
                'total' => $favorites->total(),
            ],
        ], 'Favorites retrieved successfully');
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $data = $request->validate([
            'listing_id' => ['required', 'integer', 'exists:listings,id'],
        ]);

        $listing = Listing::findOrFail($data['listing_id']);

        $favorite = $request->user()->favorites()->firstOrCreate([
            'listing_id' => $listing->id,
        ]);

        return $this->created(['id' => $favorite->id], 'Listing added to your favorites.');
    }

    public function destroy(Request $request, Listing $listing): \Illuminate\Http\JsonResponse
    {
        $request->user()->favorites()->where('listing_id', $listing->id)->delete();

        return $this->success(null, 'Listing removed from your favorites.');
    }
}