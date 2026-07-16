<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $purchase_receive_id
 * @property int $purchase_order_item_id
 * @property int $item_id
 * @property int|null $location_id
 * @property string $quantity
 * @property string $unit_cost
 */
#[Fillable([
    'purchase_receive_id',
    'purchase_order_item_id',
    'item_id',
    'location_id',
    'quantity',
    'unit_cost',
])]
class PurchaseReceiveItem extends Model
{
    /**
     * @return BelongsTo<PurchaseReceive, $this>
     */
    public function purchaseReceive(): BelongsTo
    {
        return $this->belongsTo(PurchaseReceive::class);
    }

    /**
     * @return BelongsTo<PurchaseOrderItem, $this>
     */
    public function purchaseOrderItem(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrderItem::class);
    }

    /**
     * @return BelongsTo<Item, $this>
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * @return BelongsTo<Location, $this>
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }
}
