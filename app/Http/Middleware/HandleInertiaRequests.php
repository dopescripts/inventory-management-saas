<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = Auth::guard('web')->user();

        $user?->loadMissing('tenant.activeSubscription.plan');

        if ($user) {
            setPermissionsTeamId($user->tenant_id);
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                /** @var User|null $user */
                'user' => $user ? array_merge($user->toArray(), [
                    'roles' => $user->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                ]) : null,
                'tenant' => $user?->tenant ? [
                    'id' => $user->tenant->id,
                    'name' => $user->tenant->name,
                    'subscription' => $user->tenant->activeSubscription ? [
                        'id' => $user->tenant->activeSubscription->id,
                        'status' => $user->tenant->activeSubscription->status,
                        'expires_at' => $user->tenant->activeSubscription->expires_at,
                        'plan' => $user->tenant->activeSubscription->plan ? [
                            'id' => $user->tenant->activeSubscription->plan->id,
                            'name' => $user->tenant->activeSubscription->plan->name,
                        ] : null,
                    ] : null,
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
