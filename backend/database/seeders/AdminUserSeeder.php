<?php

namespace Database\Seeders;

use App\Models\User;
use App\Support\Roles;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $admins = [
            [
                'name' => 'DECORUM Admin',
                'email' => 'admin@decorumproperties.ng',
                'password' => 'Decorum@2026',
                'role' => Roles::SUPER_ADMIN,
            ],
            [
                'name' => 'DECORUM Manager',
                'email' => 'manager@decorumproperties.ng',
                'password' => 'Decorum@2026',
                'role' => Roles::ADMIN,
            ],
            [
                'name' => 'DECORUM Staff',
                'email' => 'staff@decorumproperties.ng',
                'password' => 'Decorum@2026',
                'role' => Roles::STAFF,
            ],
        ];

        foreach ($admins as $admin) {
            $user = User::firstOrCreate(
                ['email' => $admin['email']],
                [
                    'name' => $admin['name'],
                    'password' => Hash::make($admin['password']),
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]
            );
            $user->assignRole($admin['role']);
        }
    }
}