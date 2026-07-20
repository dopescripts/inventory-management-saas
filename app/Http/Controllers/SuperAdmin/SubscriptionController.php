<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Subscription::with(['tenant', 'plan'])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        return Inertia::render('super-admin/subscriptions/index', [
            'subscriptions' => $query->paginate(15)->withQueryString(),
            'filters' => [
                'status' => $request->input('status', ''),
            ],
        ]);
    }

    public function show(Subscription $subscription): Response
    {
        $subscription->load(['tenant', 'plan']);
        $plans = Plan::where('is_active', true)->orderBy('sort_order')->get();

        return Inertia::render('super-admin/subscriptions/show', [
            'subscription' => $subscription,
            'plans' => $plans,
        ]);
    }

    public function cancel(Subscription $subscription): RedirectResponse
    {
        $subscription->update(['status' => 'cancelled']);

        return back()->with('success', 'Subscription cancelled successfully.');
    }

    public function changePlan(Request $request, Subscription $subscription): RedirectResponse
    {
        $request->validate([
            'plan_id' => ['required', 'exists:plans,id'],
        ]);

        $plan = Plan::findOrFail($request->input('plan_id'));

        $subscription->update([
            'plan_id' => $plan->id,
        ]);

        return back()->with('success', 'Plan changed successfully.');
    }
}
