<?php

namespace App\Services\Purchasing;

use App\Enums\PurchaseStatus;
use App\Models\PurchaseOrder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PurchaseService
{
    public function store(array $data): PurchaseOrder
    {
        return DB::transaction(function () use ($data) {
            $purchaseOrder = PurchaseOrder::create([
                'purchase_number' => $this->generatePurchaseNumber(),
                'vendor_id' => $data['vendor_id'],
                'expected_date' => $data['expected_date'] ?? null,
                'notes' => $data['notes'] ?? null,
                'discount' => $data['discount'] ?? 0,
                'tax' => $data['tax'] ?? 0,
                'shipping' => $data['shipping'] ?? 0,
                'status' => PurchaseStatus::Draft,
                'ordered_by' => Auth::id(),
            ]);

            $this->syncItems($purchaseOrder, $data['items']);
            $this->recalculateTotals($purchaseOrder);

            return $purchaseOrder->load('items.item');
        });
    }

    public function update(PurchaseOrder $purchaseOrder, array $data): PurchaseOrder
    {
        return DB::transaction(function () use ($purchaseOrder, $data) {
            $purchaseOrder->update([
                'vendor_id' => $data['vendor_id'],
                'expected_date' => $data['expected_date'] ?? null,
                'notes' => $data['notes'] ?? null,
                'discount' => $data['discount'] ?? 0,
                'tax' => $data['tax'] ?? 0,
                'shipping' => $data['shipping'] ?? 0,
            ]);

            $this->syncItems($purchaseOrder, $data['items']);
            $this->recalculateTotals($purchaseOrder);

            return $purchaseOrder->fresh('items.item');
        });
    }

    public function delete(PurchaseOrder $purchaseOrder): void
    {
        DB::transaction(function () use ($purchaseOrder) {
            $purchaseOrder->items()->delete();
            $purchaseOrder->delete();
        });
    }

    protected function syncItems(PurchaseOrder $purchaseOrder, array $items): void
    {
        $purchaseOrder->items()->delete();

        foreach ($items as $item) {
            $quantity = (float) $item['quantity_ordered'];
            $unitCost = (float) $item['unit_cost'];
            $discount = (float) ($item['discount'] ?? 0);
            $tax = (float) ($item['tax'] ?? 0);
            $lineTotal = ($quantity * $unitCost) - $discount + $tax;

            $purchaseOrder->items()->create([
                'item_id' => $item['item_id'],
                'quantity_ordered' => $quantity,
                'unit_cost' => $unitCost,
                'discount' => $discount,
                'tax' => $tax,
                'total' => $lineTotal,
                'remarks' => $item['remarks'] ?? null,
            ]);
        }
    }

    protected function recalculateTotals(PurchaseOrder $purchaseOrder): void
    {
        $subtotal = $purchaseOrder->items()->sum('total');

        $total = (float) $subtotal
            - (float) $purchaseOrder->discount
            + (float) $purchaseOrder->tax
            + (float) $purchaseOrder->shipping;

        $purchaseOrder->update([
            'subtotal' => $subtotal,
            'total' => $total,
        ]);
    }

    protected function generatePurchaseNumber(): string
    {
        $last = PurchaseOrder::where('tenant_id', Auth::guard('web')->user()->tenant_id)
            ->latest('id')
            ->first();

        $next = $last
            ? intval(substr($last->purchase_number, 3)) + 1
            : 1;

        return 'PO-'.str_pad($next, 6, '0', STR_PAD_LEFT);
    }
}
