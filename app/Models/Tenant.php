<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

/**
 * @property int $id
 * @property string $name
 * @property string $logo
 */
#[Fillable(['name', 'logo'])]
class Tenant extends Model
{
    /**
     * Summary of users
     *
     * @return HasMany<User, Tenant>
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Summary of activeSubscription
     *
     * @return HasOne<Subscription, Tenant>
     */
    public function activeSubscription(): HasOne
    {
        return $this->hasOne(Subscription::class)
            ->whereIn('status', ['trial', 'active'])
            ->where('expires_at', '>=', now())
            ->latest();
    }

    /**
     * Summary of plan
     *
     * @return HasOneThrough<Plan, Subscription, Tenant>
     */
    public function plan(): HasOneThrough
    {
        return $this->hasOneThrough(Plan::class, Subscription::class, 'tenant_id', 'id', 'id', 'plan_id')
            ->whereIn('plan_subscriptions.status', ['trial', 'active'])
            ->where('plan_subscriptions.expires_at', '>=', now());
    }

    /**
     * Summary of hasActiveSubscription
     */
    public function hasActiveSubscription(): bool
    {
        return $this->activeSubscription()->exists();
    }
}
