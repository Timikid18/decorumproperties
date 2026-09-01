<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Automobile extends Model
{
    use HasFactory;

    protected $fillable = [
        'listing_id',
        'make',
        'model',
        'year',
        'mileage',
        'transmission',
        'fuel_type',
        'body_type',
        'color',
        'doors',
        'seats',
        'engine_size',
        'registration_number',
    ];

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }
}