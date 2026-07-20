<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name',
    'max_warehouses',
    'max_items',
    'max_orders',
    'has_whatsapp',
    'price',
    'trial_days',
    'billing_period',
    'yearly_price',
    'is_active',
    'sort_order',
    'description',
    'features',
])]
class Plan extends Model
{
    protected function casts(): array
    {
        return [
            'has_whatsapp' => 'boolean',
            'is_active' => 'boolean',
            'features' => 'array',
            'price' => 'decimal:2',
            'yearly_price' => 'decimal:2',
        ];
    }

    /**
     * @return HasMany<Subscription, $this>
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('price');
    }

    public function isFree(): bool
    {
        return (float) $this->price === 0.0;
    }
}
