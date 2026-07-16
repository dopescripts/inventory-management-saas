<?php

namespace App\Models;

use App\Enums\PurchaseStatus;
use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property string $purchase_number
 * @property PurchaseStatus $status
 * @property int $tenant_id
 * @property int $vendor_id
 * @property int $ordered_by
 * @property int|null $approved_by
 * @property string|null $expected_date
 * @property string $subtotal
 * @property string $discount
 * @property string $tax
 * @property string $shipping
 * @property string $total
 * @property string|null $notes
 * @property Carbon|null $approved_at
 */
#[Fillable([
    'tenant_id',
    'vendor_id',
    'purchase_number',
    'status',
    'expected_date',
    'ordered_by',
    'approved_by',
    'subtotal',
    'discount',
    'tax',
    'shipping',
    'total',
    'notes',
    'approved_at',
])]
class PurchaseOrder extends Model
{
    use BelongsToTenant;

    protected function casts(): array
    {
        return [
            'status' => PurchaseStatus::class,
            'expected_date' => 'date',
            'approved_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Vendor, $this>
     */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function orderedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ordered_by');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * @return HasMany<PurchaseOrderItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    /**
     * @return HasMany<PurchaseReceive, $this>
     */
    public function receives(): HasMany
    {
        return $this->hasMany(PurchaseReceive::class);
    }
}
