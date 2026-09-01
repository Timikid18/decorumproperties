<?php

namespace App\Enums;

enum SellRequestStatus: string
{
    case Pending = 'pending';
    case Reviewing = 'reviewing';
    case Contacted = 'contacted';
    case Accepted = 'accepted';
    case Rejected = 'rejected';
    case Purchased = 'purchased';
    case Closed = 'closed';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Reviewing => 'Reviewing',
            self::Contacted => 'Contacted',
            self::Accepted => 'Accepted',
            self::Rejected => 'Rejected',
            self::Purchased => 'Purchased',
            self::Closed => 'Closed',
        };
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_map(fn (self $c) => $c->value, self::cases());
    }
}