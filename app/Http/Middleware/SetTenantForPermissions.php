<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SetTenantForPermissions
{
    public function handle(Request $request, Closure $next)
    {
        $tenantId = Auth::guard('web')->user()?->tenant_id;

        if (! $tenantId) {
            abort(403, 'Tenant access required.');
        }

        setPermissionsTeamId($tenantId);

        Auth::guard('web')->user()->unsetRelation('roles')->unsetRelation('permissions');

        return $next($request);
    }
}
