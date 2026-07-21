<?php

namespace App\Services\Purchasing;

use App\Enums\InventoryMovementDirection;
use App\Enums\PurchaseStatus;
use App\Models\PurchaseOrder;
use App\Models\PurchaseReceive;
use App\Services\Inventory\InventoryMovementService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PurchaseWorkflowService
{
    public function __construct(
        public InventoryMovementService $inventoryMovementService,
        public BillService $billService,
    ) {}

    public function submit(PurchaseOrder $purchaseOrder): PurchaseOrder
    {
        return DB::transaction(function () use ($purchaseOrder) {
            if ($purchaseOrder->status !== PurchaseStatus::Draft) {
                throw ValidationException::withMessages([
                    'status' => 'Only draft purchase orders can be submitted.',
                ]);
            }

            if ($purchaseOrder->items()->count() === 0) {
                throw ValidationException::withMessages([
                    'items' => 'Cannot submit a purchase order without items.',
                ]);
            }

            $purchaseOrder->update([
                'status' => PurchaseStatus::Pending,
            ]);

            return $purchaseOrder;
        });
    }

    public function approve(PurchaseOrder $purchaseOrder): PurchaseOrder
    {
        return DB::transaction(function () use ($purchaseOrder) {
            if ($purchaseOrder->status !== PurchaseStatus::Pending) {
                throw ValidationException::withMessages([
                    'status' => 'Only pending purchase orders can be approved.',
                ]);
            }

            $purchaseOrder->update([
                'status' => PurchaseStatus::Approved,
                'approved_at' => now(),
                'approved_by' => Auth::id(),
            ]);

            return $purchaseOrder;
        });
    }

    public function cancel(PurchaseOrder $purchaseOrder): PurchaseOrder
    {
        return DB::transaction(function () use ($purchaseOrder) {
            if (in_array($purchaseOrder->status, [
                PurchaseStatus::Received,
                PurchaseStatus::PartiallyReceived,
                PurchaseStatus::Closed,
                PurchaseStatus::Cancelled,
            ])) {
                throw ValidationException::withMessages([
                    'status' => 'This purchase order cannot be cancelled.',
                ]);
            }

            $purchaseOrder->update([
                'status' => PurchaseStatus::Cancelled,
            ]);

            return $purchaseOrder;
        });
    }

    public function close(PurchaseOrder $purchaseOrder): PurchaseOrder
    {
        return DB::transaction(function () use ($purchaseOrder) {
            if (! in_array($purchaseOrder->status, [PurchaseStatus::Received, PurchaseStatus::PartiallyReceived])) {
                throw ValidationException::withMessages([
                    'status' => 'Only received or partially received purchase orders can be closed.',
                ]);
            }

            $newStatus = $purchaseOrder->status === PurchaseStatus::PartiallyReceived 
                ? PurchaseStatus::PartiallyClosed 
                : PurchaseStatus::Closed;

            $purchaseOrder->update([
                'status' => $newStatus,
            ]);

            return $purchaseOrder;
        });
    }

    public function receive(PurchaseOrder $purchaseOrder, array $data): PurchaseOrder
    {
        return DB::transaction(function () use ($purchaseOrder, $data) {
            if (! in_array($purchaseOrder->status, [PurchaseStatus::Approved, PurchaseStatus::PartiallyReceived])) {
                throw ValidationException::withMessages([
                    'status' => 'Only approved or partially received purchase orders can receive goods.',
                ]);
            }

            $receive = PurchaseReceive::create([
                'purchase_order_id' => $purchaseOrder->id,
                'warehouse_id' => $data['warehouse_id'],
                'received_by' => Auth::id(),
                'received_at' => now(),
                'reference' => $data['reference'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($data['items'] as $itemData) {
                $poItem = $purchaseOrder->items()->findOrFail($itemData['purchase_order_item_id']);
                $quantityToReceive = (float) $itemData['quantity'];
                $remaining = (float) $poItem->quantity_ordered - (float) $poItem->quantity_received;

                if ($quantityToReceive > $remaining) {
                    throw ValidationException::withMessages([
                        "items.{$poItem->id}" => "Cannot receive more than remaining quantity ({$remaining}) for item.",
                    ]);
                }

                $unitCost = (float) ($itemData['unit_cost'] ?? $poItem->unit_cost);

                $receive->items()->create([
                    'purchase_order_item_id' => $poItem->id,
                    'item_id' => $poItem->item_id,
                    'location_id' => $itemData['location_id'] ?? null,
                    'quantity' => $quantityToReceive,
                    'unit_cost' => $unitCost,
                ]);

                $poItem->increment('quantity_received', $quantityToReceive);

                $this->inventoryMovementService->adjustStock(
                    itemId: $poItem->item_id,
                    warehouseId: (int) $data['warehouse_id'],
                    locationId: isset($itemData['location_id']) ? (int) $itemData['location_id'] : null,
                    direction: InventoryMovementDirection::In,
                    quantity: $quantityToReceive,
                    notes: "Received for PO {$purchaseOrder->purchase_number}",
                    performedBy: Auth::id()
                );
            }

            $purchaseOrder->load('items');
            $allReceived = $purchaseOrder->items->every(function ($item) {
                return (float) $item->quantity_received >= (float) $item->quantity_ordered;
            });

            $purchaseOrder->update([
                'status' => $allReceived ? PurchaseStatus::Received : PurchaseStatus::PartiallyReceived,
            ]);

            $this->billService->generateFromReceive($receive);

            return $purchaseOrder;
        });
    }
}
