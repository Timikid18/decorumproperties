<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SellRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'whatsapp' => $this->whatsapp,
            'category_name' => $this->category_name,
            'item_title' => $this->item_title,
            'description' => $this->description,
            'condition' => $this->condition,
            'asking_price' => $this->asking_price === null ? null : (float) $this->asking_price,
            'asking_price_formatted' => $this->asking_price === null ? null : '₦'.number_format((float) $this->asking_price),
            'location' => $this->location,
            'listing_type' => $this->listing_type,
            'property_type' => $this->property_type,
            'land_size' => $this->land_size === null ? null : (float) $this->land_size,
            'land_size_unit' => $this->land_size_unit,
            'documents' => $this->documents,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'additional_info' => $this->additional_info,
            'status' => $this->status,
            'images' => $this->whenLoaded('images', fn () => $this->images->map(fn ($img) => [
                'id' => $img->id,
                'url' => $img->url,
                'is_main' => $img->is_main,
            ])->values()),
            'category' => $this->whenLoaded('category', fn () => $this->category ? [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ] : null),
            'notes' => $this->whenLoaded('notes', fn () => $this->notes->map(fn ($note) => [
                'id' => $note->id,
                'body' => $note->body,
                'user' => $note->user?->name,
                'created_at' => $note->created_at->toISOString(),
            ])->values()),
            'created_at' => $this->created_at,
        ];
    }
}