<?php

namespace App\Http\Resources;

class ListingDetailResource extends ListingResource
{
    protected function withDetail(): bool
    {
        return true;
    }
}