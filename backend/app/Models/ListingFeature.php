<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ListingFeature extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['listing_id', 'name', 'position'];

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }
}