<?php

namespace App\Http\Requests\Admin;

use App\Enums\EnquiryStatus;
use App\Enums\SellRequestStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StatusUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $allowed = match ($this->route('type')) {
            'enquiry' => EnquiryStatus::values(),
            'sell-request' => SellRequestStatus::values(),
            default => [],
        };

        return [
            'status' => ['required', Rule::in($allowed)],
        ];
    }
}