<?php

namespace App\Services\Purchasing;

use App\Enums\BillStatus;
use App\Models\PurchaseBill;
use App\Models\PurchaseOrder;
use App\Models\PurchaseReceive;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BillService
{
    public function generateFromReceive(PurchaseReceive $receive): PurchaseBill
    {
        return DB::transaction(function () use ($receive) {
            $po = $receive->purchaseOrder;
            $tenant = $po->tenant;

            $bill = PurchaseBill::create([
                'tenant_id' => $tenant->id,
                'purchase_order_id' => $po->id,
                'purchase_receive_id' => $receive->id,
                'bill_number' => $this->generateBillNumber(),
                'currency_id' => $tenant->default_currency_id,
                'subtotal' => 0,
                'discount' => 0,
                'tax' => 0,
                'total' => 0,
                'status' => BillStatus::Draft,
                'due_date' => now()->addDays(30),
                'notes' => "Auto-generated from receive #{$receive->id} for PO {$po->purchase_number}",
                'issued_at' => now(),
                'created_by' => Auth::id(),
            ]);

            $subtotal = 0;
            $totalDiscount = 0;
            $totalTax = 0;

            foreach ($receive->items as $receiveItem) {
                $poItem = $receiveItem->purchaseOrderItem;
                $lineTotal = ($receiveItem->quantity * $receiveItem->unit_cost);
                $lineDiscount = $poItem ? ($poItem->discount / $poItem->quantity_ordered) * $receiveItem->quantity : 0;
                $lineTax = $poItem ? ($poItem->tax / $poItem->quantity_ordered) * $receiveItem->quantity : 0;

                $bill->items()->create([
                    'purchase_order_item_id' => $poItem?->id,
                    'item_id' => $receiveItem->item_id,
                    'description' => $receiveItem->item?->name,
                    'quantity' => $receiveItem->quantity,
                    'unit_cost' => $receiveItem->unit_cost,
                    'discount' => $lineDiscount,
                    'tax' => $lineTax,
                    'total' => $lineTotal - $lineDiscount + $lineTax,
                ]);

                $subtotal += $lineTotal;
                $totalDiscount += $lineDiscount;
                $totalTax += $lineTax;
            }

            $bill->update([
                'subtotal' => $subtotal,
                'discount' => $totalDiscount,
                'tax' => $totalTax,
                'total' => $subtotal - $totalDiscount + $totalTax,
            ]);

            return $bill->fresh(['items']);
        });
    }

    public function generateFromPurchaseOrder(PurchaseOrder $po): PurchaseBill
    {
        return DB::transaction(function () use ($po) {
            $tenant = $po->tenant;

            $bill = PurchaseBill::create([
                'tenant_id' => $tenant->id,
                'purchase_order_id' => $po->id,
                'bill_number' => $this->generateBillNumber(),
                'currency_id' => $tenant->default_currency_id,
                'subtotal' => $po->subtotal,
                'discount' => $po->discount,
                'tax' => $po->tax,
                'total' => $po->total,
                'status' => BillStatus::Draft,
                'due_date' => now()->addDays(30),
                'issued_at' => now(),
                'created_by' => Auth::id(),
            ]);

            foreach ($po->items as $poItem) {
                $bill->items()->create([
                    'purchase_order_item_id' => $poItem->id,
                    'item_id' => $poItem->item_id,
                    'description' => $poItem->item?->name,
                    'quantity' => $poItem->quantity_ordered,
                    'unit_cost' => $poItem->unit_cost,
                    'discount' => $poItem->discount,
                    'tax' => $poItem->tax,
                    'total' => $poItem->total,
                ]);
            }

            return $bill->fresh(['items']);
        });
    }

    public function store(array $data): PurchaseBill
    {
        return DB::transaction(function () use ($data) {
            $bill = PurchaseBill::create([
                ...$data,
                'bill_number' => $this->generateBillNumber(),
                'status' => BillStatus::Draft,
                'created_by' => Auth::id(),
            ]);

            if (isset($data['items'])) {
                foreach ($data['items'] as $item) {
                    $bill->items()->create($item);
                }
                $this->recalculateTotals($bill);
            }

            return $bill->fresh(['items']);
        });
    }

    public function update(PurchaseBill $bill, array $data): PurchaseBill
    {
        return DB::transaction(function () use ($bill, $data) {
            $bill->update($data);

            if (isset($data['items'])) {
                $bill->items()->delete();
                foreach ($data['items'] as $item) {
                    $bill->items()->create($item);
                }
                $this->recalculateTotals($bill);
            }

            return $bill->fresh(['items']);
        });
    }

    public function markAsPaid(PurchaseBill $bill): void
    {
        $bill->update([
            'status' => BillStatus::Paid,
            'paid_amount' => $bill->total,
        ]);
    }

    public function cancel(PurchaseBill $bill): void
    {
        $bill->update(['status' => BillStatus::Cancelled]);
    }

    private function generateBillNumber(): string
    {
        $tenantId = Auth::user()->tenant_id;
        $lastBill = PurchaseBill::withoutGlobalScopes()
            ->where('tenant_id', $tenantId)
            ->orderByDesc('id')
            ->first();

        $nextNumber = $lastBill
            ? (int) substr($lastBill->bill_number, 5) + 1
            : 1;

        return 'BILL-'.str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }

    private function recalculateTotals(PurchaseBill $bill): void
    {
        $items = $bill->items;
        $subtotal = $items->sum(fn ($item) => $item->quantity * $item->unit_cost);
        $discount = $items->sum('discount');
        $tax = $items->sum('tax');

        $bill->update([
            'subtotal' => $subtotal,
            'discount' => $discount,
            'tax' => $tax,
            'total' => $subtotal - $discount + $tax,
        ]);
    }
}
