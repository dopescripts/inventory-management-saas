<?php

namespace App\Services\Sales;

use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
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

        $order->update(['status' => 'confirmed']);

        return $order;
    }

    public function cancelOrder(SalesOrder $order): SalesOrder
    {
        if (in_array($order->status, ['shipped', 'completed', 'cancelled'])) {
            throw new InvalidArgumentException('Order cannot be cancelled from its current status.');
        }

        $order->update(['status' => 'cancelled']);

        return $order;
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
