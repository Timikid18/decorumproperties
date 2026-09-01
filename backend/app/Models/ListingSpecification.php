<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ListingSpecification extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['listing_id', 'label', 'value', 'position'];

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }
}