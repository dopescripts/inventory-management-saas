<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

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
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}
