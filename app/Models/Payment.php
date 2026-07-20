<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $tenant_id
 * @property int|null $subscription_id
 * @property string $amount
 * @property string $currency
 * @property string $status
 * @property string|null $payment_method
 * @property string|null $transaction_id
 * @property array|null $metadata
 * @property string|null $paid_at
 */
#[Fillable([
    'tenant_id',
    'subscription_id',
    'amount',
    'currency',
    'status',
    'payment_method',
    'transaction_id',
    'metadata',
    'paid_at',
])]
class Payment extends Model
{
    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'paid_at' => 'datetime',
            'amount' => 'decimal:2',
        ];
    }

    /**
     * @return BelongsTo<Tenant, $this>
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * @return BelongsTo<Subscription, $this>
     */
    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }
}
