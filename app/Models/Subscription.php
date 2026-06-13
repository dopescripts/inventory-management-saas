<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
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

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function checkActiveSubscription()
    {
        return $this->where('tenant_id', Auth::guard('web')->user()->tenant_id)
            ->where('status', 'active')
            ->where('expires_at', '>=', Carbon::now())
            ->first();
    }
}
