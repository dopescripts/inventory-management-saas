<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SuperAdmin\TenantRequest;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
    public function index(): Response
    {
        $tenants = Tenant::with(['users' => fn ($q) => $q->limit(1), 'activeSubscription.plan'])
            ->withCount('users')
            ->latest()
            ->paginate(15);

        return Inertia::render('super-admin/tenants/index', [
            'tenants' => $tenants,
        ]);
    }

    public function show(Tenant $tenant): Response
    {
        $tenant->load([
            'users',
            'activeSubscription.plan',
            'currency',
        ]);

        $subscriptionHistory = Subscription::where('tenant_id', $tenant->id)
            ->with('plan')
            ->latest()
            ->get();

        return Inertia::render('super-admin/tenants/show', [
            'tenant' => $tenant,
            'subscriptionHistory' => $subscriptionHistory,
        ]);
    }

    public function create(): Response
    {
        $plans = Plan::where('is_active', true)->orderBy('sort_order')->get();

        return Inertia::render('super-admin/tenants/create', [
            'plans' => $plans,
        ]);
    }

    public function store(TenantRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $tenant = Tenant::create([
                'name' => $request->validated('company_name'),
                'billing_email' => $request->validated('billing_email'),
                'billing_phone' => $request->validated('billing_phone'),
                'billing_address' => $request->validated('billing_address'),
            ]);

            $user = User::create([
                'name' => $request->validated('owner_name'),
                'email' => $request->validated('owner_email'),
                'password' => Hash::make($request->validated('owner_password')),
                'tenant_id' => $tenant->id,
                'onboarding_completed_at' => now(),
            ]);

            if ($request->validated('plan_id')) {
                $plan = Plan::findOrFail($request->validated('plan_id'));

                Subscription::create([
                    'tenant_id' => $tenant->id,
                    'plan_id' => $plan->id,
                    'starts_at' => now()->toDateString(),
                    'expires_at' => now()->addMonth()->toDateString(),
                    'status' => 'active',
                ]);
            }

            setPermissionsTeamId($tenant->id);
            $user->assignRole('owner');
            Cache::forget('spatie.permission.cache');
        });

        return redirect()->route('super-admin.tenants.index')
            ->with('success', 'Tenant created successfully.');
    }

    public function edit(Tenant $tenant): Response
    {
        return Inertia::render('super-admin/tenants/edit', [
            'tenant' => $tenant,
        ]);
    }

    public function update(TenantRequest $request, Tenant $tenant): RedirectResponse
    {
        $tenant->update($request->safe()->only([
            'company_name' => 'name',
            'billing_email',
            'billing_phone',
            'billing_address',
            'tax_id',
        ]));

        if ($request->has('company_name')) {
            $tenant->update(['name' => $request->validated('company_name')]);
        }

        return redirect()->route('super-admin.tenants.index')
            ->with('success', 'Tenant updated successfully.');
    }

    public function destroy(Tenant $tenant): RedirectResponse
    {
        if ($tenant->hasActiveSubscription()) {
            return back()->with('error', 'Cannot delete tenant with an active subscription.');
        }

        $tenant->users()->delete();
        $tenant->delete();

        return redirect()->route('super-admin.tenants.index')
            ->with('success', 'Tenant deleted successfully.');
    }
}
