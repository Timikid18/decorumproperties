<?php

namespace App\Policies;

use App\Models\SellRequest;
use App\Models\User;
use App\Support\Permissions;

class SellRequestPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission(Permissions::MANAGE_SELL_REQUESTS);
    }

    public function view(User $user, SellRequest $sellRequest): bool
    {
        return $user->hasPermission(Permissions::MANAGE_SELL_REQUESTS)
            || $sellRequest->user_id === $user->id;
    }

    public function update(User $user, SellRequest $sellRequest): bool
    {
        return $user->hasPermission(Permissions::MANAGE_SELL_REQUESTS);
    }

    public function delete(User $user, SellRequest $sellRequest): bool
    {
        return $user->hasPermission(Permissions::MANAGE_SELL_REQUESTS);
    }
}