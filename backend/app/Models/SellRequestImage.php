<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SellRequestImage extends Model
{
    use HasFactory;

    protected $fillable = ['sell_request_id', 'path', 'original_name', 'mime', 'size', 'is_main', 'sort_order'];

    protected function casts(): array
    {
        return [
            'is_main' => 'boolean',
        ];
    }

    public function sellRequest(): BelongsTo
    {
        return $this->belongsTo(SellRequest::class);
    }

    public function getUrlAttribute(): string
    {
        return asset('storage/'.$this->path);
    }
}