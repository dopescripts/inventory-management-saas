<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modules = [
            'warehouses',
            'items',
            'purchases',
            'sales',
            'reports',
            'staff',
            'units',
            'brands',
            'categories',
            'adjustments',
            'transfers',
            'vendors',
            'bills',
        ];
        $actions = ['view', 'create', 'update', 'delete'];
        $permissions = [];
        foreach ($modules as $module) {
            foreach ($actions as $action) {
                // E.g. view_warehouses
                $name = "{$action}_{$module}";
                $permissions[] = $name;
                Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
            }
        }

        $workflowPermissions = [
            'submit_transfers',
            'approve_transfers',
            'ship_transfers',
            'receive_transfers',
            'cancel_transfers',
            'submit_purchases',
            'approve_purchases',
            'receive_purchases',
            'cancel_purchases',
            'close_purchases',
            'download_bills',
        ];

        foreach ($workflowPermissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        // Owner gets everything implicitly or explicitly. Let's explicitly give them everything.
        $ownerRole = Role::firstOrCreate(['name' => 'owner', 'guard_name' => 'web']);
        $ownerRole->syncPermissions(Permission::where('guard_name', 'web')->get());
        // Manager gets most things except maybe deleting staff, or maybe they get everything except staff management
        $managerRole = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);
        $managerPermissions = Permission::where('guard_name', 'web')
            ->where('name', 'not like', '%_staff')
            ->get();
        $managerRole->syncPermissions($managerPermissions);
        // Staff gets view and create, maybe update, but no delete
        $staffRole = Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'web']);
        $staffPermissions = Permission::where('guard_name', 'web')
            ->where(function ($q) {
                $q->where('name', 'like', 'view_%')
                    ->orWhere('name', 'like', 'create_%')
                    ->orWhere('name', 'like', 'update_%');
            })
            ->where('name', 'not like', '%_staff')
            ->get();
        $staffRole->syncPermissions($staffPermissions);
    }
}
