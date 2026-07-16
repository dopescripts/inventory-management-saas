<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $tenant_id
 * @property int $purchase_order_id
 * @property int $warehouse_id
 * @property int $received_by
 * @property Carbon $received_at
 * @property string|null $reference
 * @property string|null $notes
 */
#[Fillable([
    'tenant_id',
    'purchase_order_id',
    'warehouse_id',
    'received_by',
    'received_at',
    'reference',
    'notes',
])]
class PurchaseReceive extends Model
{
    use BelongsToTenant;

    protected function casts(): array
    {
        return [
            'received_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<PurchaseOrder, $this>
     */
    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    /**
     * @return BelongsTo<Warehouse, $this>
     */
    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function receivedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'received_by');
    }

    /**
     * @return HasMany<PurchaseReceiveItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(PurchaseReceiveItem::class);
    }
}
