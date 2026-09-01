<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Support\Permissions;
use App\Support\Roles;
use Illuminate\Database\Seeder;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        $matrix = [
            Roles::SUPER_ADMIN => Permissions::all(),
            Roles::ADMIN => Permissions::all(),
            Roles::STAFF => [
                Permissions::VIEW_DASHBOARD,
                Permissions::MANAGE_LISTINGS,
                Permissions::PUBLISH_LISTINGS,
                Permissions::FEATURE_LISTINGS,
                Permissions::MANAGE_ENQUIRIES,
                Permissions::MANAGE_SELL_REQUESTS,
            ],
            Roles::CUSTOMER => [],
        ];

        foreach ($matrix as $slug => $permissionSlugs) {
            $role = Role::updateOrCreate(
                ['slug' => $slug],
                ['name' => ucwords(str_replace('-', ' ', $slug))]
            );

            $permissionIds = collect($permissionSlugs)
                ->map(fn (string $ps) => Permission::updateOrCreate(
                    ['slug' => $ps],
                    ['name' => ucwords(str_replace('-', ' ', $ps))]
                )->id);

            $role->permissions()->sync($permissionIds);
        }
    }
}