<?php

namespace App\Enums;

enum ListingType: string
{
    case Property = 'property';
    case Land = 'land';
    case Automobile = 'automobile';
    case Gadget = 'gadget';
    case Appliance = 'appliance';
    case Furniture = 'furniture';
    case Electronics = 'electronics';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Property => 'Property',
            self::Land => 'Land',
            self::Automobile => 'Automobile',
            self::Gadget => 'Gadget',
            self::Appliance => 'Appliance',
            self::Furniture => 'Furniture',
            self::Electronics => 'Electronics',
            self::Other => 'Other',
        };
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_map(fn (self $c) => $c->value, self::cases());
    }
}