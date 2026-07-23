<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

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

        $user?->loadMissing('tenant.activeSubscription.plan', 'tenant.currency');

        if ($user) {
            setPermissionsTeamId($user->tenant_id);
            $user->unsetRelation('roles')->unsetRelation('permissions');
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? array_merge($user->toArray(), [
                    'roles' => $user->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                    'unread_notifications_count' => $user->unreadNotifications()->count(),
                    'recent_notifications' => $user->notifications()->take(10)->get(),
                ]) : null,

                'tenant' => $user?->tenant
                    ? Cache::remember(
                        "tenant:{$user->tenant_id}:auth_payload",
                        now()->addDay(),
                        function () use ($user) {
                            return [
                                'id' => $user->tenant->id,
                                'name' => $user->tenant->name,
                                'logo' => $user->tenant->logo
                                    ? Storage::url($user->tenant->logo)
                                    : null,
                                'currency' => $user->tenant->currency ? [
                                    'id' => $user->tenant->currency->id,
                                    'code' => $user->tenant->currency->code,
                                    'symbol' => $user->tenant->currency->symbol,
                                    'decimal_places' => $user->tenant->currency->decimal_places,
                                ] : null,
                                'subscription' => $user->tenant->activeSubscription ? [
                                    'id' => $user->tenant->activeSubscription->id,
                                    'status' => $user->tenant->activeSubscription->status,
                                    'expires_at' => $user->tenant->activeSubscription->expires_at,
                                    'plan' => $user->tenant->activeSubscription->plan ? [
                                        'id' => $user->tenant->activeSubscription->plan->id,
                                        'name' => $user->tenant->activeSubscription->plan->name,
                                    ] : null,
                                ] : null,
                            ];
                        }
                    )
                    : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
