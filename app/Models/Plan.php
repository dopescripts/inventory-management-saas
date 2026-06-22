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
])]
class Plan extends Model
{
    /**
     * Summary of subscriptions
     * @return HasMany<Subscription, Plan>
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }
}
