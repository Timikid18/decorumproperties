<?php

namespace Database\Seeders;

use App\Models\User;
use App\Support\Roles;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $password = $this->configuredPassword();

        if (! $password) {
            $password = Str::random(32);
            echo "  No SEED_ADMIN_PASSWORD set. Generated random password for admin accounts:\n  {$password}\n\n";
        }

        $admins = [
            [
                'name' => 'DECORUM Admin',
                'email' => 'admin@decorumproperties.ng',
                'role' => Roles::SUPER_ADMIN,
            ],
            [
                'name' => 'DECORUM Manager',
                'email' => 'manager@decorumproperties.ng',
                'role' => Roles::ADMIN,
            ],
            [
                'name' => 'DECORUM Staff',
                'email' => 'staff@decorumproperties.ng',
                'role' => Roles::STAFF,
            ],
        ];

        foreach ($admins as $admin) {
            $user = User::firstOrCreate(
                ['email' => $admin['email']],
                [
                    'name' => $admin['name'],
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]
            );

            if ($user->wasRecentlyCreated || $this->configuredPassword()) {
                $user->update(['password' => Hash::make($password)]);
            }

            $user->assignRole($admin['role']);
        }
    }

    private function configuredPassword(): ?string
    {
        $fromEnv = getenv('SEED_ADMIN_PASSWORD');

        if ($fromEnv) {
            return $fromEnv;
        }

        $file = base_path('.env');

        if (! is_file($file)) {
            return null;
        }

        $contents = file_get_contents($file);

        if ($contents !== false && preg_match('/^SEED_ADMIN_PASSWORD\s*=\s*(?:"([^"]*)"|([^\s]*))/m', $contents, $matches)) {
            $value = $matches[1] !== '' ? $matches[1] : ($matches[2] ?? '');

            return $value !== '' ? $value : null;
        }

        return null;
    }
}