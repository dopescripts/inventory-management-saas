<?php

namespace App\Services\Inventory;

use App\Enums\InventoryMovementDirection;
use App\Enums\InventoryMovementReferenceType;
use App\Models\InventoryMovement;
use App\Models\Item;
use App\Models\User;
use App\Notifications\LowStockAlert;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class InventoryMovementService
{
    /**
     * Record a stock adjustment (increase or decrease).
     *
     * This is the primary public entry point for writing to the movement ledger
     * from user-facing actions. It computes balance_after automatically.
     */
    public function adjustStock(
        int $itemId,
        int $warehouseId,
        ?int $locationId,
        InventoryMovementDirection $direction,
        string|float|int $quantity,
        ?string $notes = null,
        ?int $performedBy = null,
        InventoryMovementReferenceType $referenceType = InventoryMovementReferenceType::Adjustment,
        ?int $referenceId = null,
    ): InventoryMovement {
        $tenantId = Auth::guard('web')->user()->tenant_id;
        $currentBalance = $this->itemBalance($tenantId, $itemId, $warehouseId, $locationId);
        $qty = number_format((float) $quantity, 4, '.', '');

        $balanceAfter = $direction === InventoryMovementDirection::In
            // @phpstan-ignore argument.type
            ? bcadd($currentBalance, $qty, 4)
            // @phpstan-ignore argument.type
            : bcsub($currentBalance, $qty, 4);

        return $this->record([
            'tenant_id' => $tenantId,
            'item_id' => $itemId,
            'warehouse_id' => $warehouseId,
            'location_id' => $locationId,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'direction' => $direction,
            'quantity' => $quantity,
            'balance_after' => $balanceAfter,
            'notes' => $notes,
            'performed_by' => $performedBy,
        ]);
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
     * Persist a raw movement record. Internal use only — callers should use
     * adjustStock() or domain-specific methods (e.g. recordOpeningStock).
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
    protected function record(array $attributes): InventoryMovement
    {
        return DB::transaction(function () use ($attributes): InventoryMovement {
            $movement = InventoryMovement::create($this->normalizeAttributes($attributes));

            if (isset($attributes['item_id'])) {
                $item = Item::find($attributes['item_id']);
                if ($item && $item->track_inventory && $item->low_stock_threshold > 0) {
                    $balanceAfter = $attributes['balance_after'] ?? $this->itemBalance($attributes['tenant_id'], $item->id);

                    $qty = (float) $movement->quantity;
                    $balanceBefore = $movement->direction === InventoryMovementDirection::Out->value || $movement->direction === InventoryMovementDirection::Out
                        ? (float) $balanceAfter + $qty
                        : (float) $balanceAfter - $qty;

                    if ((float) $balanceAfter <= (float) $item->low_stock_threshold && $balanceBefore > (float) $item->low_stock_threshold) {
                        $users = User::where('tenant_id', $attributes['tenant_id'])->get();
                        Notification::send($users, new LowStockAlert($item, (float) $balanceAfter));
                    }
                }
            }

            return $movement;
        });
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

        return number_format((float) ($result->balance ?? 0), 4, '.', '');
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
     * @param  Builder<InventoryMovement>  $query
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
