<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'super_admin',
                'guard' => 'super_admin'
            ],
            [
                'name' => 'owner',
                'guard' => 'web'
            ],
            [
                'name' => 'manager',
                'guard' => 'web'
            ],
            [
                'name' => 'staff',
                'guard' => 'web'
            ]
        ];
        foreach ($roles as $role) {
            Role::updateOrCreate([
                'name' => $role['name']
            ], [
                'name' => $role['name'],
                'guard_name' => $role['guard']
            ]);
        }
    }
}
