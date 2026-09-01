<?php

namespace App\Policies;

use App\Models\Enquiry;
use App\Models\User;
use App\Support\Permissions;

class EnquiryPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission(Permissions::MANAGE_ENQUIRIES);
    }

    public function view(User $user, Enquiry $enquiry): bool
    {
        return $user->hasPermission(Permissions::MANAGE_ENQUIRIES)
            || $enquiry->user_id === $user->id;
    }

    public function update(User $user, Enquiry $enquiry): bool
    {
        return $user->hasPermission(Permissions::MANAGE_ENQUIRIES);
    }

    public function delete(User $user, Enquiry $enquiry): bool
    {
        return $user->hasPermission(Permissions::MANAGE_ENQUIRIES);
    }
}