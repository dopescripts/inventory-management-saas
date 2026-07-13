<?php

namespace App\Services\Inventory;

use App\Enums\TransferStatus;
// use App\Models\Transfer;
use App\Models\Transfers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransferService
{
    public function store(array $data): Transfers
    {
        return DB::transaction(function () use ($data) {

            $transfer = Transfers::create([
                'transfer_number' => $this->generateTransferNumber(),
                'source_warehouse_id' => $data['source_warehouse_id'],
                'source_location_id' => $data['source_location_id'] ?? null,
                'destination_warehouse_id' => $data['destination_warehouse_id'],
                'destination_location_id' => $data['destination_location_id'] ?? null,
                'notes' => $data['notes'] ?? null,
                'status' => TransferStatus::Draft,
                // 'tenant_id' => tenant()->id,
                'requested_by' => Auth::id(),
                'requested_at' => now(),
            ]);

            foreach ($data['items'] as $item) {
                $transfer->items()->create([
                    // 'tenant_id' => tenant()->id,
                    'item_id' => $item['item_id'],
                    'quantity_requested' => $item['quantity_requested'],
                    'remarks' => $item['remarks'] ?? null,
                ]);
            }

            return $transfer->load('items.item');
        });
    }

    public function update(Transfers $transfer, array $data): Transfers
    {
        return DB::transaction(function () use ($transfer, $data) {

            $transfer->update([
                'source_warehouse_id' => $data['source_warehouse_id'],
                'source_location_id' => $data['source_location_id'] ?? null,
                'destination_warehouse_id' => $data['destination_warehouse_id'],
                'destination_location_id' => $data['destination_location_id'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            $transfer->items()->delete();

            foreach ($data['items'] as $item) {
                $transfer->items()->create([
                    // 'tenant_id' => tenant()->id,
                    'item_id' => $item['item_id'],
                    'quantity_requested' => $item['quantity_requested'],
                    'remarks' => $item['remarks'] ?? null,
                ]);
            }

            return $transfer->fresh('items.item');
        });
    }

    public function delete(Transfers $transfer): void
    {
        DB::transaction(function () use ($transfer) {
            $transfer->delete();
        });
    }

    protected function generateTransferNumber(): string
    {
        $last = Transfers::where('tenant_id', Auth::guard('web')->user()->tenant_id)
            ->latest('id')
            ->first();

        $next = $last
            ? intval(substr($last->transfer_number, 4)) + 1
            : 1;

        return 'TRF-' . str_pad($next, 6, '0', STR_PAD_LEFT);
    }
}