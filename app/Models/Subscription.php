<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

/**
 * @property int $id
 * @property int $tenant_id
 * @property int $plan_id
 * @property Carbon $starts_at
 * @property Carbon $expires_at
 * @property string $status
 */
#[Fillable(['tenant_id', 'plan_id', 'starts_at', 'expires_at', 'status'])]
class Subscription extends Model
{
    protected $table = 'plan_subscriptions';

    /**
     * Summary of tenant
     *
     * @return BelongsTo<Tenant, Subscription>
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Summary of plan
     *
     * @return BelongsTo<Plan, Subscription>
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * Summary of checkActiveSubscription
     *
     * @return Subscription|\stdClass|null
     */
    public function checkActiveSubscription(): ?self
    {
        $tenantId = Auth::guard('web')->user()?->tenant_id;

        if ($tenantId === null) {
            return null;
        }

        return $this->where('tenant_id', $tenantId)
            ->whereIn('status', ['trial', 'active'])
            ->where('expires_at', '>=', Carbon::now())
            ->first();
    }
}
