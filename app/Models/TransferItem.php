<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $transfer_id
 * @property int $item_id
 * @property int $tenant_id
 * @property string $quantity_requested
 * @property string|null $quantity_shipped
 * @property string|null $quantity_received
 * @property string|null $remarks
 */
#[Fillable([
    'transfer_id',
    'item_id',
    'tenant_id',
    'quantity_requested',
    'quantity_shipped',
    'quantity_received',
    'remarks',
])]
class TransferItem extends Model
{
    use HasFactory, BelongsToTenant;

    protected function casts(): array
    {
        return [
            'quantity_requested' => 'decimal:4',
            'quantity_shipped' => 'decimal:4',
            'quantity_received' => 'decimal:4',
        ];
    }

    public function transfer(): BelongsTo
    {
        return $this->belongsTo(Transfers::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}