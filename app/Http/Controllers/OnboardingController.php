<?php

namespace App\Http\Controllers;

use App\Contracts\PaymentServiceInterface;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingController extends Controller
{
    public function show(Request $request): Response
    {
        $user = Auth::guard('web')->user();
        $tenant = $user->tenant;

        $step = $this->determineStep($tenant);

        return Inertia::render('onboarding', [
            'step' => $step,
            'tenant' => $tenant->only(['id', 'name', 'logo', 'billing_address', 'billing_phone', 'billing_email', 'tax_id']),
            'plans' => Plan::where('is_active', true)->orderBy('sort_order')->get(),
            'selectedPlanId' => session('onboarding_plan_id'),
        ]);
    }

    public function storeCompany(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'billing_address' => ['nullable', 'string', 'max:500'],
            'billing_phone' => ['nullable', 'string', 'max:50'],
            'billing_email' => ['nullable', 'email', 'max:255'],
            'tax_id' => ['nullable', 'string', 'max:100'],
        ]);

        $tenant = Auth::guard('web')->user()->tenant;

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('tenant-logos', 'public');
        }

        $tenant->update($validated);

        return redirect()->route('onboarding.show');
    }

    public function storePlan(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'plan_id' => ['required', 'exists:plans,id'],
        ]);

        session(['onboarding_plan_id' => (int) $validated['plan_id']]);

        return redirect()->route('onboarding.show');
    }

    public function storePayment(Request $request, PaymentServiceInterface $paymentService): RedirectResponse
    {
        $planId = session('onboarding_plan_id');

        if (! $planId) {
            return redirect()->route('onboarding.show');
        }

        $plan = Plan::findOrFail($planId);
        $user = Auth::guard('web')->user();
        $tenant = $user->tenant;

        $paymentDetails = [];
        if ($plan->price > 0) {
            $validated = $request->validate([
                'card_number' => ['required', 'string'],
                'expiry' => ['required', 'string'],
                'cvv' => ['required', 'string'],
                'card_holder' => ['required', 'string', 'max:255'],
            ]);
            $paymentDetails = $validated;
        }

        return DB::transaction(function () use ($plan, $tenant, $user, $paymentService, $paymentDetails): RedirectResponse {
            $result = $paymentService->charge($tenant, $plan, $paymentDetails);

            $payment = Payment::create([
                'tenant_id' => $tenant->id,
                'amount' => $plan->price,
                'currency' => 'USD',
                'status' => $result->success ? 'completed' : 'failed',
                'payment_method' => 'card',
                'transaction_id' => $result->transactionId,
                'metadata' => ['plan_id' => $plan->id],
                'paid_at' => $result->success ? now() : null,
            ]);

            if (! $result->success) {
                return redirect()->route('onboarding.show')
                    ->with('error', 'Payment failed. Please try again.');
            }

            Subscription::where('tenant_id', $tenant->id)
                ->whereIn('status', ['trial', 'active'])
                ->update(['status' => 'inactive']);

            Subscription::create([
                'tenant_id' => $tenant->id,
                'plan_id' => $plan->id,
                'starts_at' => now()->toDateString(),
                'expires_at' => $plan->trial_days > 0
                    ? now()->addDays($plan->trial_days)->toDateString()
                    : now()->addMonth()->toDateString(),
                'status' => $plan->trial_days > 0 ? 'trial' : 'active',
            ]);

            $payment->update(['subscription_id' => Subscription::where('tenant_id', $tenant->id)->latest()->value('id')]);

            $user->update(['onboarding_completed_at' => now()]);

            session()->forget('onboarding_plan_id');

            return redirect()->route('dashboard');
        });
    }

    private function determineStep($tenant): int
    {
        if (! $tenant->billing_address && ! $tenant->billing_email && ! $tenant->logo) {
            return 1;
        }

        $planId = session('onboarding_plan_id');

        if (! $planId || ! Plan::where('id', $planId)->where('is_active', true)->exists()) {
            session()->forget('onboarding_plan_id');

            return 2;
        }

        return 3;
    }
}
