<?php

namespace Tests\Feature;

use App\Enums\Feature;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Services\PlanGate;
use Carbon\CarbonInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlanGateTest extends TestCase
{
    use RefreshDatabase;

    public function test_tenant_without_current_subscription_cannot_use_limited_resources(): void
    {
        $tenant = Tenant::create(['name' => 'Acme Inventory']);
        $planGate = new PlanGate;

        $this->assertFalse($planGate->canCreateWarehouse($tenant));
        $this->assertFalse($planGate->canCreateProduct($tenant));
        $this->assertFalse($planGate->canProcessOrder($tenant));
        $this->assertFalse($planGate->hasFeature($tenant, Feature::Whatsapp));
    }

    public function test_trial_subscription_counts_as_current_plan_access(): void
    {
        $tenant = Tenant::create(['name' => 'Acme Inventory']);
        $plan = $this->createPlan([
            'max_warehouses' => 1,
            'max_items' => 1,
            'max_orders' => 1,
            'has_whatsapp' => true,
        ]);

        $this->createSubscription($tenant, $plan, 'trial');
        $planGate = new PlanGate;

        $this->assertTrue($tenant->hasActiveSubscription());
        $this->assertTrue($planGate->canCreateWarehouse($tenant));
        $this->assertTrue($planGate->canCreateProduct($tenant));
        $this->assertTrue($planGate->canProcessOrder($tenant));
        $this->assertTrue($planGate->hasFeature($tenant, Feature::Whatsapp));
    }

    public function test_expired_subscription_does_not_grant_plan_access(): void
    {
        $tenant = Tenant::create(['name' => 'Acme Inventory']);
        $plan = $this->createPlan([
            'max_warehouses' => -1,
            'max_items' => -1,
            'max_orders' => -1,
            'has_whatsapp' => true,
        ]);

        $this->createSubscription($tenant, $plan, 'active', now()->subDays(10), now()->subDay());
        $planGate = new PlanGate;

        $this->assertFalse($tenant->hasActiveSubscription());
        $this->assertFalse($planGate->canCreateWarehouse($tenant));
        $this->assertFalse($planGate->canCreateProduct($tenant));
        $this->assertFalse($planGate->canProcessOrder($tenant));
        $this->assertFalse($planGate->hasFeature($tenant, Feature::Whatsapp));
    }

    public function test_unlimited_plan_limits_allow_resource_usage(): void
    {
        $tenant = Tenant::create(['name' => 'Acme Inventory']);
        $plan = $this->createPlan([
            'max_warehouses' => -1,
            'max_items' => -1,
            'max_orders' => -1,
            'has_whatsapp' => false,
        ]);

        $this->createSubscription($tenant, $plan);
        $planGate = new PlanGate;

        $this->assertTrue($planGate->canCreateWarehouse($tenant));
        $this->assertTrue($planGate->canCreateProduct($tenant));
        $this->assertTrue($planGate->canProcessOrder($tenant));
        $this->assertFalse($planGate->hasFeature($tenant, Feature::Whatsapp));
    }

    public function test_zero_plan_limits_block_resource_usage(): void
    {
        $tenant = Tenant::create(['name' => 'Acme Inventory']);
        $plan = $this->createPlan([
            'max_warehouses' => 0,
            'max_items' => 0,
            'max_orders' => 0,
            'has_whatsapp' => false,
        ]);

        $this->createSubscription($tenant, $plan);
        $planGate = new PlanGate;

        $this->assertFalse($planGate->canCreateWarehouse($tenant));
        $this->assertFalse($planGate->canCreateProduct($tenant));
        $this->assertFalse($planGate->canProcessOrder($tenant));
    }

    public function test_inactive_subscription_does_not_grant_plan_access(): void
    {
        $tenant = Tenant::create(['name' => 'Acme Inventory']);
        $plan = $this->createPlan([
            'max_warehouses' => -1,
            'max_items' => -1,
            'max_orders' => -1,
            'has_whatsapp' => true,
        ]);

        $this->createSubscription($tenant, $plan, 'inactive');
        $planGate = new PlanGate;

        $this->assertFalse($tenant->hasActiveSubscription());
        $this->assertFalse($planGate->canCreateWarehouse($tenant));
        $this->assertFalse($planGate->canCreateProduct($tenant));
        $this->assertFalse($planGate->canProcessOrder($tenant));
        $this->assertFalse($planGate->hasFeature($tenant, Feature::Whatsapp));
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function createPlan(array $overrides = []): Plan
    {
        return Plan::create([
            'name' => $overrides['name'] ?? fake()->words(2, true),
            'max_warehouses' => $overrides['max_warehouses'] ?? 1,
            'max_items' => $overrides['max_items'] ?? 50,
            'max_orders' => $overrides['max_orders'] ?? 20,
            'has_whatsapp' => $overrides['has_whatsapp'] ?? false,
            'price' => $overrides['price'] ?? 0,
            'trial_days' => $overrides['trial_days'] ?? 14,
        ]);
    }

    private function createSubscription(
        Tenant $tenant,
        Plan $plan,
        string $status = 'active',
        ?CarbonInterface $startsAt = null,
        ?CarbonInterface $expiresAt = null,
    ): Subscription {
        return Subscription::create([
            'tenant_id' => $tenant->id,
            'plan_id' => $plan->id,
            'starts_at' => ($startsAt ?? now())->toDateString(),
            'expires_at' => ($expiresAt ?? now()->addDays(14))->toDateString(),
            'status' => $status,
        ]);
    }
}
