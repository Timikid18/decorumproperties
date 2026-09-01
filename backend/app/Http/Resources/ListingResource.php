<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingResource extends JsonResource
{
    /**
     * Whether the full (detail-page) payload should be included. Card responses return false.
     */
    protected function withDetail(): bool
    {
        return false;
    }

    public function toArray(Request $request): array
    {
        $mainImage = null;
        if ($this->relationLoaded('images')) {
            $mainImage = $this->images->firstWhere('is_main', true) ?? $this->images->first();
        }

        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'price' => $this->price === null ? null : (float) $this->price,
            'price_formatted' => $this->formattedPrice(),
            'currency' => $this->currency,
            'is_price_negotiable' => $this->is_price_negotiable,
            'listing_type' => $this->listing_type,
            'location' => $this->location,
            'state' => $this->state,
            'country' => $this->country,
            'condition' => $this->condition,
            'status' => $this->status,
            'is_featured' => $this->is_featured,
            'views' => $this->views,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'published_at' => $this->published_at,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'main_image' => $mainImage ? $this->imageUrl($mainImage->path) : null,
        ];

        if ($this->withDetail()) {
            $data['description'] = $this->description;
            $data['video_url'] = $this->video_url;
            $data['meta_title'] = $this->meta_title;
            $data['meta_description'] = $this->meta_description;
            $data['latitude'] = $this->latitude;
            $data['longitude'] = $this->longitude;
            $data['is_favorited'] = $this->when(
                auth('sanctum')->check() && $this->relationLoaded('favorites'),
                fn () => $this->favorites->contains(fn ($f) => $f->user_id === auth('sanctum')->id())
            );
            $data['images'] = $this->when($this->relationLoaded('images'), $this->images->map(fn ($img) => [
                'id' => $img->id,
                'url' => $this->imageUrl($img->path),
                'is_main' => $img->is_main,
                'sort_order' => $img->sort_order,
            ])->values());
            $data['features'] = ListingFeatureResource::collection($this->whenLoaded('features'));
            $data['specifications'] = ListingSpecificationResource::collection($this->whenLoaded('specifications'));
            $data['property'] = new PropertyResource($this->whenLoaded('property'));
            $data['automobile'] = new AutomobileResource($this->whenLoaded('automobile'));
        }

        return $data;
    }

    protected function formattedPrice(): ?string
    {
        if ($this->price === null) {
            return null;
        }

        if ($this->currency === 'NGN') {
            return '₦'.number_format((float) $this->price);
        }

        return $this->currency.' '.number_format((float) $this->price);
    }

    protected function imageUrl(string $path): string
    {
        return asset('storage/'.$path);
    }
}