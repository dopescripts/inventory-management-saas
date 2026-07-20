<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $now = Carbon::now();

        $totalTenants = Tenant::count();
        $activeSubscriptions = Subscription::whereIn('status', ['trial', 'active'])
            ->where('expires_at', '>=', $now)
            ->count();
        $monthlyRevenue = Subscription::where('status', 'active')
            ->where('expires_at', '>=', $now)
            ->join('plans', 'plan_subscriptions.plan_id', '=', 'plans.id')
            ->sum('plans.price');
        $newSignupsThisMonth = Tenant::where('created_at', '>=', $now->copy()->startOfMonth())->count();
        $expiringTrials = Subscription::where('status', 'trial')
            ->whereBetween('expires_at', [$now, $now->copy()->addDays(7)])
            ->count();

        $planDistribution = Plan::withCount(['subscriptions' => function ($query) use ($now) {
            $query->whereIn('status', ['trial', 'active'])
                ->where('expires_at', '>=', $now);
        }])->where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'price']);

        return Inertia::render('super-admin/dashboard', [
            'stats' => [
                'totalTenants' => $totalTenants,
                'activeSubscriptions' => $activeSubscriptions,
                'monthlyRevenue' => (float) $monthlyRevenue,
                'newSignupsThisMonth' => $newSignupsThisMonth,
                'expiringTrials' => $expiringTrials,
            ],
            'planDistribution' => $planDistribution,
        ]);
    }
}
