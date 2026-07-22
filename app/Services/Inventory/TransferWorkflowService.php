<?php

namespace App\Services\Inventory;

use App\Enums\InventoryMovementDirection;
use App\Enums\InventoryMovementReferenceType;
use App\Enums\TransferStatus;
use App\Models\Transfers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TransferWorkflowService
{
    public function __construct(
        public InventoryMovementService $inventoryMovementService
    ) {}

    public function submit(Transfers $transfer): Transfers
    {
        return DB::transaction(function () use ($transfer) {
            if ($transfer->status !== TransferStatus::Draft) {
                throw ValidationException::withMessages([
                    'status' => 'Only draft transfers can be submitted.',
                ]);
            }

            if ($transfer->items()->count() === 0) {
                throw ValidationException::withMessages([
                    'items' => 'Cannot submit a transfer without items.',
                ]);
            }

            $transfer->update([
                'status' => TransferStatus::Pending,
                'requested_at' => now(),
            ]);

            return $transfer;
        });
    }

    public function approve(Transfers $transfer): Transfers
    {
        return DB::transaction(function () use ($transfer) {
            if ($transfer->status !== TransferStatus::Pending) {
                throw ValidationException::withMessages([
                    'status' => 'Only pending transfers can be approved.',
                ]);
            }

            $transfer->update([
                'status' => TransferStatus::Approved,
                'approved_at' => now(),
                'approved_by' => Auth::id(),
            ]);

            return $transfer;
        });
    }

    public function cancel(Transfers $transfer): Transfers
    {
        return DB::transaction(function () use ($transfer) {
            if (in_array($transfer->status, [TransferStatus::Shipped, TransferStatus::Received, TransferStatus::Cancelled])) {
                throw ValidationException::withMessages([
                    'status' => 'This transfer cannot be cancelled.',
                ]);
            }

            $transfer->update([
                'status' => TransferStatus::Cancelled,
            ]);

            return $transfer;
        });
    }

    public function ship(Transfers $transfer, array $items): Transfers
    {
        return DB::transaction(function () use ($transfer, $items) {
            if (! in_array($transfer->status, [TransferStatus::Approved, TransferStatus::Shipped])) {
                throw ValidationException::withMessages([
                    'status' => 'Only approved or partially shipped transfers can be shipped.',
                ]);
            }

            $tenantId = $transfer->tenant_id;

            foreach ($items as $itemData) {
                $transferItem = $transfer->items()->findOrFail($itemData['id']);
                $quantityToShip = (float) $itemData['quantity'];

                $availableBalance = (float) ($transfer->source_location_id
                    ? $this->inventoryMovementService->locationBalance($tenantId, $transfer->source_location_id, $transferItem->item_id)
                    : $this->inventoryMovementService->warehouseBalance($tenantId, $transfer->source_warehouse_id, $transferItem->item_id));

                if ($availableBalance < $quantityToShip) {
                    throw ValidationException::withMessages([
                        "items.{$itemData['id']}" => "Insufficient stock for item ID {$transferItem->item_id}.",
                    ]);
                }

                $this->inventoryMovementService->adjustStock(
                    itemId: $transferItem->item_id,
                    warehouseId: $transfer->source_warehouse_id,
                    locationId: $transfer->source_location_id,
                    direction: InventoryMovementDirection::Out,
                    quantity: $quantityToShip,
                    notes: "Shipped for transfer {$transfer->transfer_number}",
                    performedBy: Auth::id(),
                    referenceType: InventoryMovementReferenceType::TransferOut,
                    referenceId: $transfer->id
                );

                $transferItem->quantity_shipped = ($transferItem->quantity_shipped ?? 0) + $quantityToShip;
                $transferItem->save();
            }

            $transfer->update([
                'status' => TransferStatus::Shipped,
                'shipped_at' => $transfer->shipped_at ?? now(),
            ]);

            return $transfer;
        });
    }

    public function receive(Transfers $transfer, array $items): Transfers
    {
        return DB::transaction(function () use ($transfer, $items) {
            if ($transfer->status !== TransferStatus::Shipped) {
                throw ValidationException::withMessages([
                    'status' => 'Only shipped transfers can be received.',
                ]);
            }

            foreach ($items as $itemData) {
                $transferItem = $transfer->items()->findOrFail($itemData['id']);
                $quantityToReceive = (float) $itemData['quantity'];

                $this->inventoryMovementService->adjustStock(
                    itemId: $transferItem->item_id,
                    warehouseId: $transfer->destination_warehouse_id,
                    locationId: $transfer->destination_location_id,
                    direction: InventoryMovementDirection::In,
                    quantity: $quantityToReceive,
                    notes: "Received for transfer {$transfer->transfer_number}",
                    performedBy: Auth::id(),
                    referenceType: InventoryMovementReferenceType::TransferIn,
                    referenceId: $transfer->id
                );

                $transferItem->quantity_received = ($transferItem->quantity_received ?? 0) + $quantityToReceive;
                $transferItem->save();
            }

            $allReceived = true;
            $transfer->load('items');
            foreach ($transfer->items as $transferItem) {
                if ((float) $transferItem->quantity_received < (float) $transferItem->quantity_requested) {
                    $allReceived = false;
                    break;
                }
            }

            if ($allReceived) {
                $transfer->update([
                    'status' => TransferStatus::Received,
                    'received_at' => now(),
                    'received_by' => Auth::id(),
                ]);
            }

            return $transfer;
        });
    }
}
