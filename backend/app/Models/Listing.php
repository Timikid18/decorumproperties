<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Listing extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'listing_type',
        'title',
        'slug',
        'short_description',
        'description',
        'price',
        'currency',
        'is_price_negotiable',
        'location',
        'state',
        'country',
        'latitude',
        'longitude',
        'condition',
        'status',
        'is_published',
        'is_featured',
        'is_demo',
        'views',
        'video_url',
        'meta_title',
        'meta_description',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_price_negotiable' => 'boolean',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'is_demo' => 'boolean',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'published_at' => 'datetime',
        ];
    }

    // ---------------------------------------------------------------- relations

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ListingImage::class)->orderBy('sort_order')->orderBy('id');
    }

    public function features(): HasMany
    {
        return $this->hasMany(ListingFeature::class)->orderBy('position');
    }

    public function specifications(): HasMany
    {
        return $this->hasMany(ListingSpecification::class)->orderBy('position');
    }

    public function property(): HasOne
    {
        return $this->hasOne(Property::class);
    }

    public function automobile(): HasOne
    {
        return $this->hasOne(Automobile::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function enquiries(): HasMany
    {
        return $this->hasMany(Enquiry::class);
    }

    // ---------------------------------------------------------------- scopes

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true)->whereNotNull('published_at');
    }

    public function scopeNotDemo(Builder $query): Builder
    {
        return $query->where('is_demo', false);
    }

    public function scopeWithStatus(Builder $query, ?string $status): Builder
    {
        return $status ? $query->where('status', $status) : $query;
    }

    public function scopeOfType(Builder $query, ?string $type): Builder
    {
        return $type ? $query->where('listing_type', $type) : $query;
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        if (! empty($filters['q'])) {
            $term = '%'.trim((string) $filters['q']).'%';
            $query->where(function (Builder $q) use ($term) {
                $q->where('title', 'like', $term)
                    ->orWhere('location', 'like', $term)
                    ->orWhere('short_description', 'like', $term)
                    ->orWhere('description', 'like', $term);
            });
        }

        if (! empty($filters['category'])) {
            $query->whereHas('category', function (Builder $q) use ($filters) {
                $q->where('slug', $filters['category'])
                    ->orWhere('parent_id', Category::where('slug', $filters['category'])->value('id'));
            });
        }

        if (! empty($filters['listing_type'])) {
            $query->where('listing_type', $filters['listing_type']);
        }

        if (! empty($filters['location'])) {
            $query->where('location', 'like', '%'.trim((string) $filters['location']).'%');
        }

        if (! empty($filters['state'])) {
            $query->where('state', $filters['state']);
        }

        if (isset($filters['min_price']) && $filters['min_price'] !== '') {
            $query->where('price', '>=', (float) $filters['min_price']);
        }

        if (isset($filters['max_price']) && $filters['max_price'] !== '') {
            $query->where('price', '<=', (float) $filters['max_price']);
        }

        if (! empty($filters['condition'])) {
            $query->where('condition', $filters['condition']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query;
    }

    public function scopeSort(Builder $query, ?string $sort): Builder
    {
        return match ($sort) {
            'oldest' => $query->oldest(),
            'price_asc' => $query->orderBy('price')->orderBy('id'),
            'price_desc' => $query->orderByDesc('price')->orderByDesc('id'),
            'featured' => $query->orderByDesc('is_featured')->latest(),
            default => $query->latest(),
        };
    }

    // ---------------------------------------------------------------- helpers

    public function getMainImage(): ?ListingImage
    {
        return $this->images->firstWhere('is_main', true) ?? $this->images->first();
    }

    public function mainImageUrl(): ?string
    {
        $image = $this->getMainImage();

        return $image ? $image->url : null;
    }
}