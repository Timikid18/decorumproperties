<?php

namespace App\Http\Requests\Admin;

use Illuminate\Validation\Rule;

class UpdateListingRequest extends StoreListingRequest
{
    public function rules(): array
    {
        $rules = parent::rules();
        $rules['slug'] = ['nullable', 'string', 'max:220', Rule::unique('listings', 'slug')->ignore($this->route('listing'))];

        return $rules;
    }
}