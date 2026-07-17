<?php

namespace App\Models;

use App\Enums\BillStatus;
use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'tenant_id',
    'purchase_order_id',
    'purchase_receive_id',
    'bill_number',
    'currency_id',
    'subtotal',
    'discount',
    'tax',
    'total',
    'status',
    'due_date',
    'paid_amount',
    'notes',
    'issued_at',
    'created_by',
])]
class PurchaseBill extends Model
{
    use BelongsToTenant;

    protected function casts(): array
    {
        return [
            'status' => BillStatus::class,
            'due_date' => 'date',
            'issued_at' => 'datetime',
            'subtotal' => 'decimal:4',
            'discount' => 'decimal:4',
            'tax' => 'decimal:4',
            'total' => 'decimal:4',
            'paid_amount' => 'decimal:4',
        ];
    }

    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function purchaseReceive(): BelongsTo
    {
        return $this->belongsTo(PurchaseReceive::class);
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseBillItem::class);
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
