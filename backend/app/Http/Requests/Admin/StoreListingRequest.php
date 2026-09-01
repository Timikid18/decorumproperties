<?php

namespace App\Http\Requests\Admin;

use App\Enums\ItemCondition;
use App\Enums\ListingStatus;
use App\Enums\ListingType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:200'],
            'slug' => ['nullable', 'string', 'max:220', 'unique:listings,slug'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'listing_type' => ['required', Rule::in(ListingType::values())],
            'short_description' => ['nullable', 'string', 'max:300'],
            'description' => ['nullable', 'string', 'max:20000'],
            'price' => ['nullable', 'numeric', 'min:0', 'max:999999999999'],
            'currency' => ['nullable', 'string', 'max:8'],
            'is_price_negotiable' => ['sometimes', 'boolean'],
            'location' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:80'],
            'country' => ['nullable', 'string', 'max:80'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'condition' => ['nullable', Rule::in(ItemCondition::values())],
            'status' => ['required', Rule::in(ListingStatus::values())],
            'is_published' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'video_url' => ['nullable', 'url', 'max:500'],
            'meta_title' => ['nullable', 'string', 'max:160'],
            'meta_description' => ['nullable', 'string', 'max:320'],
            'images' => ['nullable', 'array', 'max:15'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            'features' => ['nullable', 'array', 'max:30'],
            'features.*' => ['string', 'max:150'],
            'specifications' => ['nullable', 'array', 'max:30'],
            'specifications.*.label' => ['required_with:specifications', 'string', 'max:150'],
            'specifications.*.value' => ['required_with:specifications', 'string', 'max:500'],
            // Property-specific
            'property' => ['nullable', 'array'],
            'property.property_type' => ['nullable', Rule::in(['land', 'house', 'apartment', 'commercial'])],
            'property.land_size' => ['nullable', 'numeric', 'min:0'],
            'property.land_size_unit' => ['nullable', 'string', 'max:20'],
            'property.bedrooms' => ['nullable', 'integer', 'min:0', 'max:100'],
            'property.bathrooms' => ['nullable', 'integer', 'min:0', 'max:100'],
            'property.parking_spaces' => ['nullable', 'integer', 'min:0', 'max:500'],
            'property.year_built' => ['nullable', 'integer', 'min:1800', 'max:2100'],
            'property.purpose' => ['nullable', 'string', 'max:60'],
            'property.furnishing' => ['nullable', 'string', 'max:60'],
            'property.documents' => ['nullable', 'array'],
            'property.documents.*' => ['string', 'max:120'],
            // Automobile-specific
            'automobile' => ['nullable', 'array'],
            'automobile.make' => ['nullable', 'string', 'max:80'],
            'automobile.model' => ['nullable', 'string', 'max:80'],
            'automobile.year' => ['nullable', 'integer', 'min:1950', 'max:2100'],
            'automobile.mileage' => ['nullable', 'integer', 'min:0', 'max:3000000'],
            'automobile.transmission' => ['nullable', 'string', 'max:30'],
            'automobile.fuel_type' => ['nullable', 'string', 'max:30'],
            'automobile.body_type' => ['nullable', 'string', 'max:60'],
            'automobile.color' => ['nullable', 'string', 'max:40'],
            'automobile.doors' => ['nullable', 'integer', 'min:1', 'max:20'],
            'automobile.seats' => ['nullable', 'integer', 'min:1', 'max:30'],
            'automobile.engine_size' => ['nullable', 'string', 'max:40'],
            'automobile.registration_number' => ['nullable', 'string', 'max:40'],
        ];
    }

    public function messages(): array
    {
        return [
            'images.*.image' => 'Each uploaded file must be an image.',
            'images.*.max' => 'Each image must not exceed 5MB.',
        ];
    }
}