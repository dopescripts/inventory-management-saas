<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

/**
 * Automatically scopes all queries to the authenticated user's tenant
 * and fills tenant_id on model creation.
 *
 * Apply this trait to any Model that has a tenant_id column.
 */
trait BelongsToTenant
{
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope('tenant', function (Builder $query): void {
            $user = Auth::guard('web')->user();

            if ($user) {
                $query->where(
                    (new static)->qualifyColumn('tenant_id'),
                    $user->tenant_id
                );
            }
        });

        static::creating(function (Model $model): void {
            if (empty($model->tenant_id)) {
                $model->tenant_id = Auth::guard('web')->user()?->tenant_id;
            }
        });
    }
}
