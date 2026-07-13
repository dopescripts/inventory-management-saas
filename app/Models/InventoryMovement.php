<?php

namespace App\Models;

use App\Enums\InventoryMovementDirection;
use App\Enums\InventoryMovementReferenceType;
use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $tenant_id
 * @property int|null $item_id
 * @property int|null $variant_id
 * @property int|null $warehouse_id
 * @property int|null $location_id
 * @property InventoryMovementReferenceType $reference_type
 * @property int|null $reference_id
 * @property InventoryMovementDirection $direction
 * @property string $quantity
 * @property string|null $unit_cost
 * @property string|null $balance_after
 * @property string|null $notes
 * @property int|null $performed_by
 * @property-read Tenant $tenant
 * @property-read Warehouse|null $warehouse
 * @property-read Location|null $location
 * @property-read User|null $performedBy
 */
#[Fillable([
    'tenant_id',
    'item_id',
    'variant_id',
    'warehouse_id',
    'location_id',
    'reference_type',
    'reference_id',
    'direction',
    'quantity',
    'unit_cost',
    'balance_after',
    'notes',
    'performed_by',
])]
class InventoryMovement extends Model
{
    use BelongsToTenant;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'reference_type' => InventoryMovementReferenceType::class,
            'direction' => InventoryMovementDirection::class,
            'quantity' => 'decimal:4',
            'unit_cost' => 'decimal:4',
            'balance_after' => 'decimal:4',
        ];
    }


    /**
     * Summary of item
     * @return BelongsTo<Item, InventoryMovement>
     */
    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }

    /**
     * Summary of location
     *
     * @return BelongsTo<Location, InventoryMovement>
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Summary of performedBy
     *
     * @return BelongsTo<User, InventoryMovement>
     */
    public function performedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'performed_by');
    }

    /**
     * Summary of tenant
     *
     * @return BelongsTo<Tenant, InventoryMovement>
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Summary of warehouse
     *
     * @return BelongsTo<Warehouse, InventoryMovement>
     */
    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }
}
