<?php

namespace App\Services;

use App\Models\Listing;
use App\Enums\ListingType;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ListingService
{
    /**
     * Base published query with eager loading ready for public listings.
     */
    public function publishedQuery(): Builder
    {
        $query = Listing::query()
            ->published()
            ->with(['category.group', 'images', 'property', 'automobile']);

        // Demo content is hidden in production but visible during development
        // so the marketplace never looks empty while building/testing.
        if (app()->environment('production')) {
            $query->notDemo();
        }

        return $query;
    }

    /**
     * Apply common request filters: q, category, listing_type, location, state,
     * min_price, max_price, condition, status, sort.
     */
    public function applyPublicFilters(Builder $query, Request $request): Builder
    {
        $query->filter($request->only([
            'q',
            'category',
            'listing_type',
            'location',
            'state',
            'min_price',
            'max_price',
            'condition',
            'status',
        ]));

        if ($request->boolean('featured')) {
            $query->featured();
        }

        if ($request->boolean('negotiable')) {
            $query->where('is_price_negotiable', true);
        }

        return $query;
    }

    public function applySort(Builder $query, ?string $sort): Builder
    {
        return $query->sort($sort);
    }

    public function paginate(Builder $query, Request $request): LengthAwarePaginator
    {
        $perPage = min((int) $request->input('per_page', 12), 60);

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Search endpoint used by the homepage smart search.
     */
    public function search(Request $request): LengthAwarePaginator
    {
        $query = $this->publishedQuery();

        if ($request->filled('listing_type')) {
            $query->where('listing_type', $request->string('listing_type'));
        }

        return $this->paginate(
            $this->applySort(
                $this->applyPublicFilters($query, $request),
                $request->input('sort'),
            ),
            $request,
        );
    }

    public function featured(int $limit = 8): mixed
    {
        return $this->publishedQuery()
            ->featured()
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function latest(int $limit = 12): mixed
    {
        return $this->publishedQuery()->latest()->limit($limit)->get();
    }

    public function findPublishedBySlug(string $slug): ?Listing
    {
        return $this->publishedQuery()
            ->where('slug', $slug)
            ->first();
    }

    public function incrementViews(Listing $listing): void
    {
        $listing->increment('views');
    }

    /**
     * Property/land listings with property-specific filters.
     */
    public function properties(Request $request, ?string $propertyType = null): LengthAwarePaginator
    {
        $query = $this->publishedQuery()
            ->whereIn('listing_type', [ListingType::Property->value, ListingType::Land->value])
            ->with(['property']);

        if ($propertyType) {
            $query->whereHas('property', fn (Builder $q) => $q->where('property_type', $propertyType));
        }

        foreach (['property_type', 'purpose', 'bedrooms', 'bathrooms', 'min_land_size'] as $key) {
            if (! $request->filled($key)) {
                continue;
            }
            $query->whereHas('property', function (Builder $q) use ($key, $request) {
                match ($key) {
                    'property_type' => $q->where('property_type', $request->string($key)),
                    'purpose' => $q->where('purpose', $request->string($key)),
                    'bedrooms' => $q->where('bedrooms', '>=', (int) $request->input($key)),
                    'bathrooms' => $q->where('bathrooms', '>=', (int) $request->input($key)),
                    'min_land_size' => $q->where('land_size', '>=', (float) $request->input($key)),
                };
            });
        }

        $query = $this->applyPublicFilters($query, $request);
        $query = $this->applySort($query, $request->input('sort'));

        return $this->paginate($query, $request);
    }

    /**
     * Vehicle listings with vehicle-specific filters.
     */
    public function vehicles(Request $request): LengthAwarePaginator
    {
        $query = $this->publishedQuery()
            ->where('listing_type', ListingType::Automobile->value)
            ->with(['automobile']);

        foreach (['make', 'model', 'year', 'transmission', 'fuel_type', 'body_type'] as $key) {
            if ($request->filled($key)) {
                $query->whereHas('automobile', fn (Builder $q) => $q->where($key, $request->string($key)));
            }
        }

        $query = $this->applyPublicFilters($query, $request);
        $query = $this->applySort($query, $request->input('sort'));

        return $this->paginate($query, $request);
    }

    /**
     * Products/general marketplace (non-property, non-land, non-automobile).
     */
    public function shop(Request $request): LengthAwarePaginator
    {
        $query = $this->publishedQuery()->whereNotIn('listing_type', [
            ListingType::Property->value,
            ListingType::Land->value,
            ListingType::Automobile->value,
        ]);

        $query = $this->applyPublicFilters($query, $request);
        $query = $this->applySort($query, $request->input('sort'));

        return $this->paginate($query, $request);
    }
}