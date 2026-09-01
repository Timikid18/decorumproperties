<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ListingsQueryRequest;
use App\Http\Requests\Admin\StoreListingRequest;
use App\Http\Requests\Admin\UpdateListingRequest;
use App\Http\Resources\ListingDetailResource;
use App\Http\Resources\ListingResource;
use App\Http\Responses\ApiResponse;
use App\Models\Listing;
use App\Services\FileUploadService;
use App\Services\ListingWriteService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ListingAdminController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected ListingWriteService $writer,
        protected FileUploadService $files,
    ) {}

    public function index(ListingsQueryRequest $request): \Illuminate\Http\JsonResponse
    {
        $query = Listing::query()
            ->with(['category', 'images', 'property', 'automobile'])
            ->withTrashed()
            ->when($request->filled('q'), fn ($q) => $q->where(function ($q) use ($request) {
                $q->where('title', 'like', '%'.$request->string('q').'%')
                    ->orWhere('slug', 'like', '%'.$request->string('q').'%');
            }))
            ->when($request->filled('listing_type'), fn ($q) => $q->where('listing_type', $request->string('listing_type')))
            ->when($request->filled('category_id'), fn ($q) => $q->where('category_id', $request->integer('category_id')))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->has('is_published'), fn ($q) => $q->where('is_published', $request->boolean('is_published')))
            ->when($request->has('is_featured'), fn ($q) => $q->where('is_featured', $request->boolean('is_featured')));

        $query->when($request->input('sort', 'newest') === 'price_asc', fn ($q) => $q->orderBy('price'))
            ->when($request->input('sort', 'newest') === 'price_desc', fn ($q) => $q->orderByDesc('price'))
            ->when(! in_array($request->input('sort', 'newest'), ['price_asc', 'price_desc']), fn ($q) => $request->input('sort', 'newest') === 'oldest' ? $q->oldest() : $q->latest());

        $listings = $query->paginate($request->integer('per_page', 15));

        return $this->success([
            'listings' => ListingResource::collection($listings->items()),
            'pagination' => [
                'current_page' => $listings->currentPage(),
                'last_page' => $listings->lastPage(),
                'per_page' => $listings->perPage(),
                'total' => $listings->total(),
            ],
        ], 'Listings retrieved successfully');
    }

    public function show(Listing $listing): \Illuminate\Http\JsonResponse
    {
        $listing->load(['category.group', 'images', 'features', 'specifications', 'property', 'automobile', 'user']);

        return $this->success(new ListingDetailResource($listing), 'Listing retrieved successfully');
    }

    public function store(StoreListingRequest $request): \Illuminate\Http\JsonResponse
    {
        $listing = $this->writer->create($request);

        return $this->created(new ListingDetailResource($listing->load(['category', 'images', 'features', 'specifications', 'property', 'automobile'])), 'Listing created successfully');
    }

    public function update(UpdateListingRequest $request, Listing $listing): \Illuminate\Http\JsonResponse
    {
        $listing = $this->writer->update($listing, $request);

        return $this->success(new ListingDetailResource($listing->load(['category', 'images', 'features', 'specifications', 'property', 'automobile'])), 'Listing updated successfully');
    }

    public function destroy(Listing $listing): \Illuminate\Http\JsonResponse
    {
        $listing->delete();

        return $this->success(null, 'Listing deleted successfully');
    }

    public function restore(int $id): \Illuminate\Http\JsonResponse
    {
        $listing = Listing::onlyTrashed()->findOrFail($id);
        $listing->restore();

        return $this->success(null, 'Listing restored successfully');
    }

    public function publish(Listing $listing): \Illuminate\Http\JsonResponse
    {
        $listing->update([
            'is_published' => true,
            'published_at' => $listing->published_at ?? now(),
        ]);

        return $this->success(null, 'Listing published successfully');
    }

    public function unpublish(Listing $listing): \Illuminate\Http\JsonResponse
    {
        $listing->update(['is_published' => false]);

        return $this->success(null, 'Listing unpublished');
    }

    public function feature(Listing $listing): \Illuminate\Http\JsonResponse
    {
        $listing->update(['is_featured' => ! $listing->is_featured]);

        return $this->success(['is_featured' => $listing->is_featured], $listing->is_featured ? 'Listing is now featured.' : 'Listing is no longer featured.');
    }

    public function markStatus(Request $request, Listing $listing): \Illuminate\Http\JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', \Illuminate\Validation\Rule::in(\App\Enums\ListingStatus::values())],
        ]);

        $listing->update(['status' => $data['status']]);

        return $this->success(null, 'Listing marked as '.$data['status'].'.');
    }

    public function deleteImage(Listing $listing, int $imageId): \Illuminate\Http\JsonResponse
    {
        $image = $listing->images()->findOrFail($imageId);
        $this->files->deleteImage($image->path);
        $image->delete();

        return $this->success(null, 'Image deleted successfully.');
    }

    public function setMainImage(Listing $listing, int $imageId): \Illuminate\Http\JsonResponse
    {
        $listing->images()->update(['is_main' => false]);
        $listing->images()->findOrFail($imageId)->update(['is_main' => true]);

        return $this->success(null, 'Main image updated.');
    }

    public function regenerateSlug(Listing $listing): \Illuminate\Http\JsonResponse
    {
        $base = Str::slug($listing->title);
        $slug = $base;
        $suffix = 1;
        while (Listing::where('slug', $slug)->where('id', '!=', $listing->id)->exists()) {
            $slug = $base.'-'.$suffix++;
        }
        $listing->update(['slug' => $slug]);

        return $this->success(['slug' => $slug], 'Slug regenerated successfully.');
    }
}