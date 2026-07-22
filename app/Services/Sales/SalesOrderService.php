<?php

namespace App\Services\Sales;

use App\Enums\InventoryMovementDirection;
use App\Models\InventoryReservation;
use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use App\Services\Inventory\InventoryMovementService;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class SalesOrderService
{
    public function createOrder(int $tenantId, int $customerId, int $warehouseId, string $orderDate, ?string $expectedShipDate, array $items, ?string $notes = null): SalesOrder
    {
        return DB::transaction(function () use ($tenantId, $customerId, $warehouseId, $orderDate, $expectedShipDate, $items, $notes) {

            $subtotal = 0;

            $order = SalesOrder::create([
                'tenant_id' => $tenantId,
                'number' => $this->generateOrderNumber($tenantId),
                'customer_id' => $customerId,
                'warehouse_id' => $warehouseId,
                'status' => 'draft',
                'order_date' => $orderDate,
                'expected_ship_date' => $expectedShipDate,
                'subtotal' => 0,
                'discount' => 0,
                'tax' => 0,
                'shipping' => 0,
                'total' => 0,
                'notes' => $notes,
            ]);

            foreach ($items as $item) {
                $itemTotal = $item['ordered_quantity'] * $item['unit_price'];
                $subtotal += $itemTotal;

                SalesOrderItem::create([
                    'sales_order_id' => $order->id,
                    'item_id' => $item['item_id'],
                    'ordered_quantity' => $item['ordered_quantity'],
                    'unit_price' => $item['unit_price'],
                    'total' => $itemTotal,
                ]);
            }

            $order->update([
                'subtotal' => $subtotal,
                'total' => $subtotal,
            ]);

            return $order;
        });
    }

    public function updateOrder(SalesOrder $order, array $data): SalesOrder
    {
        if ($order->status !== 'draft') {
            throw new InvalidArgumentException('Only draft orders can be updated.');
        }

        return DB::transaction(function () use ($order, $data) {
            $order->update([
                'customer_id' => $data['customer_id'] ?? $order->customer_id,
                'warehouse_id' => $data['warehouse_id'] ?? $order->warehouse_id,
                'order_date' => $data['order_date'] ?? $order->order_date,
                'expected_ship_date' => $data['expected_ship_date'] ?? $order->expected_ship_date,
                'notes' => $data['notes'] ?? $order->notes,
                'discount' => $data['discount'] ?? $order->discount,
                'tax' => $data['tax'] ?? $order->tax,
                'shipping' => $data['shipping'] ?? $order->shipping,
            ]);

            if (isset($data['items'])) {
                $order->items()->delete();
                $subtotal = 0;

                foreach ($data['items'] as $item) {
                    $itemTotal = $item['ordered_quantity'] * $item['unit_price'];
                    $subtotal += $itemTotal;

                    SalesOrderItem::create([
                        'sales_order_id' => $order->id,
                        'item_id' => $item['item_id'],
                        'ordered_quantity' => $item['ordered_quantity'],
                        'unit_price' => $item['unit_price'],
                        'total' => $itemTotal,
                    ]);
                }

                $order->update([
                    'subtotal' => $subtotal,
                    'total' => $subtotal - $order->discount + $order->tax + $order->shipping,
                ]);
            }

            return $order->fresh();
        });
    }

    public function confirmOrder(SalesOrder $order): SalesOrder
    {
        if ($order->status !== 'draft') {
            throw new InvalidArgumentException('Only draft orders can be confirmed.');
        }

        return DB::transaction(function () use ($order) {
            $order->update(['status' => 'confirmed']);

            foreach ($order->items as $item) {
                InventoryReservation::create([
                    'tenant_id' => $order->tenant_id,
                    'sales_order_id' => $order->id,
                    'sales_order_item_id' => $item->id,
                    'item_id' => $item->item_id,
                    'reserved_quantity' => $item->ordered_quantity,
                    'status' => 'reserved',
                ]);
            }

            return $order;
        });
    }

    public function shipOrder(SalesOrder $order, InventoryMovementService $inventoryService, ?int $userId = null): SalesOrder
    {
        if ($order->status !== 'confirmed') {
            throw new InvalidArgumentException('Only confirmed orders can be shipped.');
        }

        return DB::transaction(function () use ($order, $inventoryService, $userId) {
            $order->update(['status' => 'shipped']);

            foreach ($order->items as $item) {
                // Deduct stock
                $inventoryService->adjustStock(
                    $item->item_id,
                    $order->warehouse_id,
                    null, // No specific location selected
                    InventoryMovementDirection::Out,
                    $item->ordered_quantity,
                    "Sales Order #{$order->number} Shipped",
                    $userId
                );

                // Fulfill reservations
                InventoryReservation::where('sales_order_item_id', $item->id)
                    ->update(['status' => 'fulfilled']);
            }

            return $order;
        });
    }

    public function completeOrder(SalesOrder $order): SalesOrder
    {
        if ($order->status !== 'shipped') {
            throw new InvalidArgumentException('Only shipped orders can be completed.');
        }

        $order->update(['status' => 'completed']);

        return $order;
    }

    public function cancelOrder(SalesOrder $order): SalesOrder
    {
        if (in_array($order->status, ['shipped', 'completed', 'cancelled'])) {
            throw new InvalidArgumentException('Order cannot be cancelled from its current status.');
        }

        return DB::transaction(function () use ($order) {
            $order->update(['status' => 'cancelled']);

            // Release any reservations if confirmed
            InventoryReservation::where('sales_order_id', $order->id)
                ->where('status', 'reserved')
                ->update(['status' => 'released']);

            return $order;
        });
    }

    private function generateOrderNumber(int $tenantId): string
    {
        $prefix = 'SO-';
        $latestOrder = SalesOrder::where('tenant_id', $tenantId)
            ->where('number', 'like', "{$prefix}%")
            ->orderBy('id', 'desc')
            ->first();

        if (! $latestOrder) {
            return $prefix.'00001';
        }

        $lastNumber = (int) str_replace($prefix, '', $latestOrder->number);

        return $prefix.str_pad((string) ($lastNumber + 1), 5, '0', STR_PAD_LEFT);
    }
}
