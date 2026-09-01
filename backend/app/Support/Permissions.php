<?php

namespace App\Support;

class Permissions
{
    // Dashboard
    public const VIEW_DASHBOARD = 'view-dashboard';

    // Listings / catalog
    public const MANAGE_LISTINGS = 'manage-listings';
    public const PUBLISH_LISTINGS = 'publish-listings';
    public const FEATURE_LISTINGS = 'feature-listings';
    public const MANAGE_CATEGORIES = 'manage-categories';

    // CRM
    public const MANAGE_ENQUIRIES = 'manage-enquiries';
    public const MANAGE_SELL_REQUESTS = 'manage-sell-requests';

    // People
    public const MANAGE_USERS = 'manage-users';

    // Content & settings
    public const MANAGE_CONTENT = 'manage-content';
    public const MANAGE_SETTINGS = 'manage-settings';
    public const MANAGE_TESTIMONIALS = 'manage-testimonials';

    /** @return list<string> */
    public static function all(): array
    {
        return [
            self::VIEW_DASHBOARD,
            self::MANAGE_LISTINGS,
            self::PUBLISH_LISTINGS,
            self::FEATURE_LISTINGS,
            self::MANAGE_CATEGORIES,
            self::MANAGE_ENQUIRIES,
            self::MANAGE_SELL_REQUESTS,
            self::MANAGE_USERS,
            self::MANAGE_CONTENT,
            self::MANAGE_SETTINGS,
            self::MANAGE_TESTIMONIALS,
        ];
    }
}