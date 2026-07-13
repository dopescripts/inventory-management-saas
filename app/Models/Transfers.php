<?php

namespace App\Models;

use App\Enums\TransferStatus;
use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $transfer_number
 * @property int $source_warehouse_id
 * @property int|null $source_location_id
 * @property int $destination_warehouse_id
 * @property int|null $destination_location_id
 * @property TransferStatus $status
 * @property string|null $notes
 * @property int $requested_by
 * @property int|null $approved_by
 * @property int|null $received_by
 * @property int $tenant_id
 * @property \Illuminate\Support\Carbon $requested_at
 * @property \Illuminate\Support\Carbon|null $approved_at
 * @property \Illuminate\Support\Carbon|null $shipped_at
 * @property \Illuminate\Support\Carbon|null $received_at
 */
#[Fillable([
    'transfer_number',
    'source_warehouse_id',
    'source_location_id',
    'destination_warehouse_id',
    'destination_location_id',
    'status',
    'notes',
    'requested_by',
    'approved_by',
    'received_by',
    'tenant_id',
    'requested_at',
    'approved_at',
    'shipped_at',
    'received_at',
])]
class Transfers extends Model
{
    use HasFactory, BelongsToTenant;

    protected function casts(): array
    {
        return [
            'status' => TransferStatus::class,
            'requested_at' => 'datetime',
            'approved_at' => 'datetime',
            'shipped_at' => 'datetime',
            'received_at' => 'datetime',
        ];
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function sourceWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'source_warehouse_id');
    }

    public function sourceLocation(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'source_location_id');
    }

    public function destinationWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'destination_warehouse_id');
    }

    public function destinationLocation(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'destination_location_id');
    }

    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function receivedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'received_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(TransferItem::class, 'transfer_id');
    }
}