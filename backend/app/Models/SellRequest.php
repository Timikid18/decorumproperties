<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SellRequest extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'name',
        'email',
        'phone',
        'whatsapp',
        'category_name',
        'item_title',
        'description',
        'condition',
        'asking_price',
        'location',
        'listing_type',
        'property_type',
        'land_size',
        'land_size_unit',
        'documents',
        'bedrooms',
        'bathrooms',
        'additional_info',
        'status',
        'is_demo',
    ];

    protected function casts(): array
    {
        return [
            'asking_price' => 'decimal:2',
            'land_size' => 'decimal:2',
            'documents' => 'array',
            'is_demo' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(SellRequestImage::class)->orderBy('sort_order');
    }

    public function notes(): MorphMany
    {
        return $this->morphMany(AdminNote::class, 'notable');
    }
}