<?php

namespace Tests\Unit;

use App\Enums\InventoryMovementDirection;
use App\Enums\InventoryMovementReferenceType;
use App\Models\InventoryMovement;
use App\Models\Location;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Warehouse;
use App\Services\Inventory\InventoryMovementService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InventoryMovementServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_record_creates_a_normalized_inventory_movement(): void
    {
        [$tenant, $warehouse, $location, $user] = $this->createInventoryContext();

        $movement = app(InventoryMovementService::class)->record([
            'tenant_id' => $tenant->id,
            'item_id' => 42,
            'warehouse_id' => $warehouse->id,
            'location_id' => $location->id,
            'reference_type' => InventoryMovementReferenceType::OpeningStock,
            'reference_id' => null,
            'direction' => InventoryMovementDirection::In,
            'quantity' => 12.5,
            'unit_cost' => 250,
            'balance_after' => 12.5,
            'notes' => 'Opening stock for launch',
            'performed_by' => $user->id,
        ]);

        $this->assertInstanceOf(InventoryMovement::class, $movement);
        $this->assertDatabaseCount('inventory_movements', 1);
        $this->assertDatabaseHas('inventory_movements', [
            'tenant_id' => $tenant->id,
            'item_id' => 42,
            'warehouse_id' => $warehouse->id,
            'location_id' => $location->id,
            'reference_type' => InventoryMovementReferenceType::OpeningStock->value,
            'direction' => InventoryMovementDirection::In->value,
            'notes' => 'Opening stock for launch',
            'performed_by' => $user->id,
        ]);

        $this->assertSame('12.5000', $movement->getRawOriginal('quantity'));
        $this->assertSame('250.0000', $movement->getRawOriginal('unit_cost'));
        $this->assertSame('12.5000', $movement->getRawOriginal('balance_after'));
        $this->assertSame(InventoryMovementReferenceType::OpeningStock, $movement->reference_type);
        $this->assertSame(InventoryMovementDirection::In, $movement->direction);
        $this->assertSame('12.5000', $movement->quantity);
    }

    public function test_it_calculates_balances_by_scope(): void
    {
        [$tenant, $warehouseOne, $locationOne, $user] = $this->createInventoryContext();
        $warehouseTwo = Warehouse::create([
            'name' => 'Overflow Warehouse',
            'code' => 'WH-002',
            'tenant_id' => $tenant->id,
            'created_by' => $user->id,
            'is_active' => true,
        ]);
        $locationTwo = Location::create([
            'tenant_id' => $tenant->id,
            'warehouse_id' => $warehouseTwo->id,
            'code' => 'B-01',
            'is_active' => true,
            'created_by' => $user->id,
        ]);

        $service = app(InventoryMovementService::class);

        $service->record([
            'tenant_id' => $tenant->id,
            'item_id' => 42,
            'warehouse_id' => $warehouseOne->id,
            'location_id' => $locationOne->id,
            'reference_type' => InventoryMovementReferenceType::OpeningStock,
            'direction' => InventoryMovementDirection::In,
            'quantity' => 12,
            'performed_by' => $user->id,
        ]);

        $service->record([
            'tenant_id' => $tenant->id,
            'item_id' => 42,
            'warehouse_id' => $warehouseOne->id,
            'location_id' => $locationOne->id,
            'reference_type' => InventoryMovementReferenceType::Sale,
            'direction' => InventoryMovementDirection::Out,
            'quantity' => 2.25,
            'performed_by' => $user->id,
        ]);

        $service->record([
            'tenant_id' => $tenant->id,
            'item_id' => 42,
            'warehouse_id' => $warehouseTwo->id,
            'location_id' => $locationTwo->id,
            'reference_type' => InventoryMovementReferenceType::TransferIn,
            'direction' => InventoryMovementDirection::In,
            'quantity' => 4,
            'performed_by' => $user->id,
        ]);

        $this->assertDatabaseCount('inventory_movements', 3);
        $this->assertSame('13.7500', $service->itemBalance($tenant->id, 42));
        $this->assertSame('9.7500', $service->warehouseBalance($tenant->id, $warehouseOne->id, 42));
        $this->assertSame('4.0000', $service->warehouseBalance($tenant->id, $warehouseTwo->id, 42));
        $this->assertSame('9.7500', $service->locationBalance($tenant->id, $locationOne->id, 42));
    }

    /**
     * @return array{0: Tenant, 1: Warehouse, 2: Location, 3: User}
     */
    private function createInventoryContext(): array
    {
        $tenant = Tenant::create([
            'name' => 'Acme Trading',
            'logo' => null,
        ]);

        $user = User::factory()->create([
            'tenant_id' => $tenant->id,
        ]);

        $warehouse = Warehouse::create([
            'name' => 'Main Warehouse',
            'code' => 'WH-001',
            'tenant_id' => $tenant->id,
            'created_by' => $user->id,
            'is_active' => true,
        ]);

        $location = Location::create([
            'tenant_id' => $tenant->id,
            'warehouse_id' => $warehouse->id,
            'code' => 'A-01',
            'is_active' => true,
            'created_by' => $user->id,
        ]);

        return [$tenant, $warehouse, $location, $user];
    }
}
