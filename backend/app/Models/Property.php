<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'listing_id',
        'property_type',
        'land_size',
        'land_size_unit',
        'bedrooms',
        'bathrooms',
        'parking_spaces',
        'year_built',
        'purpose',
        'furnishing',
        'documents',
    ];

    protected function casts(): array
    {
        return [
            'land_size' => 'decimal:2',
            'documents' => 'array',
        ];
    }

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }
}