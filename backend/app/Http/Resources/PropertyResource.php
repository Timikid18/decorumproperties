<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'property_type' => $this->property_type,
            'land_size' => $this->land_size === null ? null : (float) $this->land_size,
            'land_size_unit' => $this->land_size_unit,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'parking_spaces' => $this->parking_spaces,
            'year_built' => $this->year_built,
            'purpose' => $this->purpose,
            'furnishing' => $this->furnishing,
            'documents' => $this->documents,
        ];
    }
}