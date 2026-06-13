<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static bool canCreateWarehouse(\App\Models\Tenant $tenant)
 * @method static bool canCreateProduct(\App\Models\Tenant $tenant)
 * @method static bool canProcessOrder(\App\Models\Tenant $tenant)
 * @method static bool hasFeature(\App\Models\Tenant $tenant, string $feature)
 * 
 * @see \App\Services\PlanGate
 */
class PlanGate extends Facade
{
    protected static function getFacadeAccessor()
    {
        return \App\Services\PlanGate::class;
    }
}
