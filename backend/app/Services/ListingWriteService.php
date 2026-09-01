<?php

namespace App\Services;

use App\Models\Listing;
use App\Models\Property;
use App\Models\Automobile;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ListingWriteService
{
    public function __construct(
        protected FileUploadService $files,
    ) {}

    /**
     * Build the base listing payload from request data.
     */
    protected function basePayload(Request $request, ?Listing $listing = null): array
    {
        return [
            'title' => $request->input('title'),
            'slug' => $request->input('slug') ? Str::slug($request->input('slug')) : Str::slug($request->input('title')),
            'category_id' => $request->input('category_id'),
            'listing_type' => $request->input('listing_type', 'other'),
            'short_description' => $request->input('short_description'),
            'description' => $request->input('description'),
            'price' => $request->input('price'),
            'currency' => $request->input('currency', 'NGN'),
            'is_price_negotiable' => $request->boolean('is_price_negotiable'),
            'location' => $request->input('location'),
            'state' => $request->input('state'),
            'country' => $request->input('country', 'Nigeria'),
            'latitude' => $request->input('latitude'),
            'longitude' => $request->input('longitude'),
            'condition' => $request->input('condition'),
            'status' => $request->input('status', 'available'),
            'is_published' => $request->boolean('is_published'),
            'is_featured' => $request->boolean('is_featured'),
            'video_url' => $request->input('video_url'),
            'meta_title' => $request->input('meta_title') ?: $request->input('title'),
            'meta_description' => $request->input('meta_description') ?: Str::limit($request->input('short_description') ?? $request->input('description') ?? '', 160),
            'published_at' => $request->boolean('is_published')
                ? ($listing?->published_at ?? now())
                : null,
        ];
    }

    public function create(Request $request): Listing
    {
        $listing = Listing::create($this->basePayload($request) + [
            'user_id' => $request->user()->id,
        ]);

        $this->saveNested($listing, $request);

        return $listing->refresh()->load(['images', 'features', 'specifications', 'property', 'automobile', 'category']);
    }

    public function update(Listing $listing, Request $request): Listing
    {
        $listing->update($data);
        $this->saveNested($listing, $request);

        return $listing->refresh()->load(['images', 'features', 'specifications', 'property', 'automobile', 'category']);
    }

    protected function saveNested(Listing $listing, Request $request): void
    {
        // Images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $stored = $this->files->storeImage($file, 'listings');
                $listing->images()->create($stored + [
                    'is_main' => $listing->images()->count() === 0,
                    'sort_order' => $listing->images()->count(),
                ]);
            }
        }

        // Features
        if ($request->filled('features')) {
            $listing->features()->delete();
            foreach (array_values($request->input('features', [])) as $position => $feature) {
                $listing->features()->create(['name' => $feature, 'position' => $position]);
            }
        }

        // Specifications
        if ($request->filled('specifications')) {
            $listing->specifications()->delete();
            foreach (array_values($request->input('specifications', [])) as $position => $spec) {
                $listing->specifications()->create([
                    'label' => $spec['label'] ?? '',
                    'value' => $spec['value'] ?? '',
                    'position' => $position,
                ]);
            }
        }

        $this->saveProperty($listing, $request);
        $this->saveAutomobile($listing, $request);
    }

    protected function saveProperty(Listing $listing, Request $request): void
    {
        $in = $request->input('property');

        if (! is_array($in)) {
            return;
        }

        $data = [
            'property_type' => $in['property_type'] ?? 'house',
            'land_size' => $in['land_size'] ?? null,
            'land_size_unit' => $in['land_size_unit'] ?? null,
            'bedrooms' => $in['bedrooms'] ?? null,
            'bathrooms' => $in['bathrooms'] ?? null,
            'parking_spaces' => $in['parking_spaces'] ?? null,
            'year_built' => $in['year_built'] ?? null,
            'purpose' => $in['purpose'] ?? null,
            'furnishing' => $in['furnishing'] ?? null,
            'documents' => $in['documents'] ?? [],
        ];

        Property::updateOrCreate(['listing_id' => $listing->id], $data);
    }

    protected function saveAutomobile(Listing $listing, Request $request): void
    {
        $in = $request->input('automobile');

        if (! is_array($in)) {
            return;
        }

        $data = array_intersect_key($in, array_flip([
            'make', 'model', 'year', 'mileage', 'transmission', 'fuel_type',
            'body_type', 'color', 'doors', 'seats', 'engine_size', 'registration_number',
        ]));

        Automobile::updateOrCreate(['listing_id' => $listing->id], $data);
    }
}