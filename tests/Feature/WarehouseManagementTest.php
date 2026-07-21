<?php

namespace Tests\Feature;

use App\Enums\TransferStatus;
use App\Models\Tenant;
use App\Models\Transfers;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WarehouseManagementTest extends TestCase
{
    use RefreshDatabase;

    private Tenant $tenant;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->artisan('db:seed', ['--class' => 'RoleSeeder']);
        $this->artisan('db:seed', ['--class' => 'PermissionSeeder']);

        $this->tenant = Tenant::create([
            'name' => 'Test Tenant',
            'onboarding_completed_at' => now(),
        ]);
        $this->owner = User::factory()->create([
            'tenant_id' => $this->tenant->id,
            'email_verified_at' => now(),
        ]);

        setPermissionsTeamId($this->tenant->id);
        $this->owner->assignRole('owner');
    }

    private function makeWarehouse(array $attributes = []): Warehouse
    {
        return Warehouse::create(array_merge([
            'name' => 'Main Warehouse',
            'code' => 'MAIN-001',
            'created_by' => $this->owner->id,
            'tenant_id' => $this->tenant->id,
            'is_active' => true,
        ], $attributes));
    }

    public function test_owner_can_view_warehouse_edit_page(): void
    {
        $warehouse = $this->makeWarehouse();

        $response = $this->actingAs($this->owner)->get(route('warehouses.edit', $warehouse));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('inventory/warehouse/edit')
            ->where('warehouse.id', $warehouse->id)
        );
    }

    public function test_owner_can_update_a_warehouse(): void
    {
        $warehouse = $this->makeWarehouse();

        $response = $this->actingAs($this->owner)->put(route('warehouses.update', $warehouse), [
            'name' => 'Updated Warehouse',
            'code' => 'MAIN-002',
            'city' => 'Karachi',
            'is_active' => false,
        ]);

        $response->assertRedirect(route('warehouses.index'));
        $this->assertDatabaseHas('warehouses', [
            'id' => $warehouse->id,
            'name' => 'Updated Warehouse',
            'code' => 'MAIN-002',
            'city' => 'Karachi',
            'is_active' => false,
        ]);
    }

    public function test_owner_can_delete_a_warehouse(): void
    {
        $warehouse = $this->makeWarehouse();

        $response = $this->actingAs($this->owner)->delete(route('warehouses.destroy', $warehouse));

        $response->assertRedirect(route('warehouses.index'));
        $this->assertDatabaseMissing('warehouses', ['id' => $warehouse->id]);
    }

    public function test_show_page_includes_transfers_involving_the_warehouse(): void
    {
        $source = $this->makeWarehouse(['code' => 'SRC-001']);
        $destination = $this->makeWarehouse(['name' => 'Second Warehouse', 'code' => 'DST-001']);

        Transfers::create([
            'transfer_number' => 'TRN-0001',
            'source_warehouse_id' => $source->id,
            'destination_warehouse_id' => $destination->id,
            'status' => TransferStatus::Draft,
            'requested_by' => $this->owner->id,
            'requested_at' => now(),
            'tenant_id' => $this->tenant->id,
        ]);

        $response = $this->actingAs($this->owner)->get(route('warehouses.show', $source));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('inventory/warehouse/show')
            ->has('transfers', 1)
            ->where('transfers.0.transfer_number', 'TRN-0001')
        );
    }
}
