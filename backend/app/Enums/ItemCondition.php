<?php

namespace App\Enums;

enum ItemCondition: string
{
    case BrandNew = 'Brand New';
    case LikeNew = 'Like New';
    case Excellent = 'Excellent';
    case Good = 'Good';
    case FairlyUsed = 'Fairly Used';
    case Used = 'Used';

    public function label(): string
    {
        return $this->value;
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_map(fn (self $c) => $c->value, self::cases());
    }
}