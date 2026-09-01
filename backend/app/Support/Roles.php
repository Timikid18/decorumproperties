<?php

namespace App\Support;

class Roles
{
    public const SUPER_ADMIN = 'super-admin';
    public const ADMIN = 'admin';
    public const STAFF = 'staff';
    public const CUSTOMER = 'customer';

    /** @return list<string> */
    public static function all(): array
    {
        return [self::SUPER_ADMIN, self::ADMIN, self::STAFF, self::CUSTOMER];
    }
}