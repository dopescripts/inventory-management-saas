<?php

namespace App\Services\Inventory;

use App\Enums\InventoryMovementDirection;
use App\Enums\InventoryMovementReferenceType;
use App\Models\InventoryMovement;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class InventoryMovementService
{
    /**
     * Record a stock movement.
     *
     * @param array{
     *     tenant_id: int,
     *     item_id?: int|null,
     *     variant_id?: int|null,
     *     warehouse_id?: int|null,
     *     location_id?: int|null,
     *     reference_type: InventoryMovementReferenceType|string,
     *     reference_id?: int|null,
     *     direction: InventoryMovementDirection|string,
     *     quantity: int|float|string,
     *     unit_cost?: int|float|string|null,
     *     balance_after?: int|float|string|null,
     *     notes?: string|null,
     *     performed_by?: int|null
     * } $attributes
     */
    public function record(array $attributes): InventoryMovement
    {
        return DB::transaction(function () use ($attributes): InventoryMovement {
            return InventoryMovement::create($this->normalizeAttributes($attributes));
        });
    }

    public function itemBalance(int $tenantId, int $itemId, ?int $warehouseId = null, ?int $locationId = null): string
    {
        return $this->balance([
            'tenant_id' => $tenantId,
            'item_id' => $itemId,
            'warehouse_id' => $warehouseId,
            'location_id' => $locationId,
        ]);
    }

    public function warehouseBalance(int $tenantId, int $warehouseId, ?int $itemId = null): string
    {
        return $this->balance([
            'tenant_id' => $tenantId,
            'warehouse_id' => $warehouseId,
            'item_id' => $itemId,
        ]);
    }

    public function locationBalance(int $tenantId, int $locationId, ?int $itemId = null): string
    {
        return $this->balance([
            'tenant_id' => $tenantId,
            'location_id' => $locationId,
            'item_id' => $itemId,
        ]);
    }

    /**
     * @param  array<string, int|null>  $filters
     */
    private function balance(array $filters): string
    {
        $query = InventoryMovement::query()
            ->selectRaw(
                'COALESCE(SUM(CASE WHEN direction = ? THEN quantity ELSE quantity * -1 END), 0) as balance',
                [InventoryMovementDirection::In->value],
            );

        $this->applyFilters($query, $filters);

        $result = $query->first();

        return number_format((float) ($result?->balance ?? 0), 4, '.', '');
    }

    /**
     * @param array{
     *     tenant_id: int,
     *     item_id?: int|null,
     *     variant_id?: int|null,
     *     warehouse_id?: int|null,
     *     location_id?: int|null,
     *     reference_type: InventoryMovementReferenceType|string,
     *     reference_id?: int|null,
     *     direction: InventoryMovementDirection|string,
     *     quantity: int|float|string,
     *     unit_cost?: int|float|string|null,
     *     balance_after?: int|float|string|null,
     *     notes?: string|null,
     *     performed_by?: int|null
     * } $attributes
     * @return array<string, mixed>
     */
    private function normalizeAttributes(array $attributes): array
    {
        return [
            'tenant_id' => $attributes['tenant_id'],
            'item_id' => $attributes['item_id'] ?? null,
            'variant_id' => $attributes['variant_id'] ?? null,
            'warehouse_id' => $attributes['warehouse_id'] ?? null,
            'location_id' => $attributes['location_id'] ?? null,
            'reference_type' => $this->enumValue($attributes['reference_type']),
            'reference_id' => $attributes['reference_id'] ?? null,
            'direction' => $this->enumValue($attributes['direction']),
            'quantity' => $this->decimal($attributes['quantity']),
            'unit_cost' => array_key_exists('unit_cost', $attributes) ? $this->decimalOrNull($attributes['unit_cost']) : null,
            'balance_after' => array_key_exists('balance_after', $attributes) ? $this->decimalOrNull($attributes['balance_after']) : null,
            'notes' => $attributes['notes'] ?? null,
            'performed_by' => $attributes['performed_by'] ?? null,
        ];
    }

    /**
     * @param  array<string, int|null>  $filters
     */
    private function applyFilters(Builder $query, array $filters): void
    {
        foreach ($filters as $column => $value) {
            if ($value === null) {
                continue;
            }

            $query->where($column, $value);
        }
    }

    private function enumValue(InventoryMovementDirection|InventoryMovementReferenceType|string $value): string
    {
        return $value instanceof InventoryMovementDirection || $value instanceof InventoryMovementReferenceType
            ? $value->value
            : $value;
    }

    private function decimal(int|float|string $value): string
    {
        return number_format((float) $value, 4, '.', '');
    }

    private function decimalOrNull(int|float|string|null $value): ?string
    {
        return $value === null ? null : $this->decimal($value);
    }
}
