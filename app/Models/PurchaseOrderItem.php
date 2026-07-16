<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $purchase_order_id
 * @property int $item_id
 * @property string $quantity_ordered
 * @property string $quantity_received
 * @property string $unit_cost
 * @property string $discount
 * @property string $tax
 * @property string $total
 * @property string|null $remarks
 */
#[Fillable([
    'purchase_order_id',
    'item_id',
    'quantity_ordered',
    'quantity_received',
    'unit_cost',
    'discount',
    'tax',
    'total',
    'remarks',
])]
class PurchaseOrderItem extends Model
{
    /**
     * @return BelongsTo<PurchaseOrder, $this>
     */
    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    /**
     * @return BelongsTo<Item, $this>
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}
