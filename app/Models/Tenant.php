<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

#[Fillable(['name'])]
class Tenant extends Model
{
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function activeSubscription(): HasOne
    {
        return $this->hasOne(Subscription::class)
            ->whereIn('status', ['trial', 'active'])
            ->where('expires_at', '>=', now())
            ->latest();
    }

    public function plan(): HasOneThrough
    {
        return $this->hasOneThrough(Plan::class, Subscription::class, 'tenant_id', 'id', 'id', 'plan_id')
            ->whereIn('plan_subscriptions.status', ['trial', 'active'])
            ->where('plan_subscriptions.expires_at', '>=', now());
    }

    public function hasActiveSubscription(): bool
    {
        return $this->activeSubscription()->exists();
    }
}
