<?php

namespace App\Policies;

use App\Models\Listing;
use App\Models\User;
use App\Support\Permissions;

class ListingPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission(Permissions::MANAGE_LISTINGS);
    }

    public function view(User $user, Listing $listing): bool
    {
        return $user->hasPermission(Permissions::MANAGE_LISTINGS)
            || $listing->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission(Permissions::MANAGE_LISTINGS);
    }

    public function update(User $user, Listing $listing): bool
    {
        return $user->hasPermission(Permissions::MANAGE_LISTINGS)
            || $listing->user_id === $user->id;
    }

    public function delete(User $user, Listing $listing): bool
    {
        return $user->hasPermission(Permissions::MANAGE_LISTINGS);
    }

    public function publish(User $user): bool
    {
        return $user->hasPermission(Permissions::PUBLISH_LISTINGS);
    }

    public function feature(User $user): bool
    {
        return $user->hasPermission(Permissions::FEATURE_LISTINGS);
    }
}