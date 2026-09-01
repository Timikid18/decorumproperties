<?php

namespace App\Policies;

use App\Models\User;
use App\Support\Permissions;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission(Permissions::MANAGE_USERS);
    }

    public function view(User $user, User $model): bool
    {
        return $user->hasPermission(Permissions::MANAGE_USERS) || $user->id === $model->id;
    }

    public function update(User $user, User $model): bool
    {
        return $user->hasPermission(Permissions::MANAGE_USERS) || $user->id === $model->id;
    }

    public function toggleStatus(User $user, User $model): bool
    {
        return $user->hasPermission(Permissions::MANAGE_USERS);
    }
}