<?php

namespace App\Console\Commands;

use App\Models\Tenant;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class SyncTenantPermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tenants:sync-permissions {--tenant-id= : Sync for specific tenant only}';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Sync permissions and roles for all (or specific) tenants';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $tenantId = $this->option('tenant-id');

        if ($tenantId) {
            $tenant = Tenant::find($tenantId);
            if (! $tenant) {
                $this->error("Tenant with ID {$tenantId} not found.");

                return 1;
            }
            $tenants = [$tenant];
        } else {
            $tenants = Tenant::all();
        }

        if ($tenants->isEmpty()) {
            $this->warn('No tenants found.');

            return 0;
        }

        $bar = $this->output->createProgressBar($tenants->count());
        $bar->start();

        foreach ($tenants as $tenant) {
            $this->syncTenantPermissions($tenant);
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('✅ Permissions synced for all tenants!');

        return 0;
    }

    /**
     * Sync permissions and roles for a specific tenant
     */
    private function syncTenantPermissions(Tenant $tenant): void
    {
        $modules = ['warehouses', 'items', 'purchases', 'sales', 'reports', 'staff', 'units', 'brands', 'categories'];
        $actions = ['view', 'create', 'update', 'delete'];

        // Create permissions for this tenant (if they don't exist)
        foreach ($modules as $module) {
            foreach ($actions as $action) {
                $name = "{$action}_{$module}";
                Permission::firstOrCreate(
                    ['name' => $name, 'guard_name' => 'web', 'team_id' => $tenant->id],
                    ['guard_name' => 'web']
                );
            }
        }

        // Get all permissions for this tenant
        $allPermissions = Permission::where('guard_name', 'web')
            ->where('team_id', $tenant->id)
            ->get();

        // Sync owner role with all permissions
        $ownerRole = Role::firstOrCreate(
            ['name' => 'owner', 'guard_name' => 'web', 'team_id' => $tenant->id],
            ['guard_name' => 'web', 'team_id' => $tenant->id]
        );
        $ownerRole->syncPermissions($allPermissions, $tenant->id);

        // Sync manager role (all except staff management)
        $managerRole = Role::firstOrCreate(
            ['name' => 'manager', 'guard_name' => 'web', 'team_id' => $tenant->id],
            ['guard_name' => 'web', 'team_id' => $tenant->id]
        );
        $managerPermissions = $allPermissions->filter(function ($p) {
            return ! str_contains($p->name, '_staff');
        });
        $managerRole->syncPermissions($managerPermissions, $tenant->id);

        // Sync staff role (view, create, update only - no delete or staff management)
        $staffRole = Role::firstOrCreate(
            ['name' => 'staff', 'guard_name' => 'web', 'team_id' => $tenant->id],
            ['guard_name' => 'web', 'team_id' => $tenant->id]
        );
        $staffPermissions = $allPermissions->filter(function ($p) {
            return (str_starts_with($p->name, 'view_') ||
                str_starts_with($p->name, 'create_') ||
                str_starts_with($p->name, 'update_'))
                && ! str_contains($p->name, '_staff');
        });
        $staffRole->syncPermissions($staffPermissions, $tenant->id);
    }
}
