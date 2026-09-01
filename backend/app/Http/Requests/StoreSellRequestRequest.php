<?php

namespace App\Http\Requests;

use App\Enums\ItemCondition;
use App\Enums\ListingType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSellRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['nullable', 'string', 'email', 'max:150'],
            'phone' => ['nullable', 'string', 'max:30'],
            'whatsapp' => ['nullable', 'string', 'max:30'],
            'category_name' => ['nullable', 'string', 'max:120'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'item_title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:5000'],
            'condition' => ['nullable', Rule::in(ItemCondition::values())],
            'asking_price' => ['nullable', 'numeric', 'min:0', 'max:999999999999'],
            'location' => ['nullable', 'string', 'max:255'],
            'listing_type' => ['nullable', Rule::in(ListingType::values())],
            'property_type' => ['nullable', 'string', 'max:60'],
            'land_size' => ['nullable', 'numeric', 'min:0'],
            'land_size_unit' => ['nullable', 'string', 'max:20'],
            'documents' => ['nullable', 'array'],
            'documents.*' => ['string', 'max:120'],
            'bedrooms' => ['nullable', 'integer', 'min:0', 'max:50'],
            'bathrooms' => ['nullable', 'integer', 'min:0', 'max:50'],
            'additional_info' => ['nullable', 'string', 'max:4000'],
            'images' => ['nullable', 'array', 'max:8'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
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