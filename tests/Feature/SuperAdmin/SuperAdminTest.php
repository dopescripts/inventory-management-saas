<?php

namespace Tests\Feature\SuperAdmin;

use App\Models\Payment;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\SuperAdmin;
use App\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SuperAdminTest extends TestCase
{
    use RefreshDatabase;

    private SuperAdmin $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->artisan('db:seed', ['--class' => 'PlanSeeder']);

        $this->admin = SuperAdmin::create([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'password' => 'password',
        ]);
    }

    public function test_super_admin_can_login()
    {
        $response = $this->post(route('super-admin.login.attempt'), [
            'email' => 'admin@test.com',
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($this->admin, 'super_admin');
        $response->assertRedirect(route('super-admin.dashboard'));
    }

    public function test_super_admin_dashboard_shows_stats()
    {
        $response = $this->actingAs($this->admin, 'super_admin')
            ->get(route('super-admin.dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('super-admin/dashboard')
            ->has('stats')
        );
    }

    public function test_super_admin_can_list_tenants()
    {
        Tenant::create(['name' => 'Tenant A']);
        Tenant::create(['name' => 'Tenant B']);

        $response = $this->actingAs($this->admin, 'super_admin')
            ->get(route('super-admin.tenants.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('super-admin/tenants/index')
            ->has('tenants.data', 2)
        );
    }

    public function test_super_admin_can_create_tenant()
    {
        $this->artisan('db:seed', ['--class' => 'RoleSeeder']);

        $plan = Plan::where('name', 'Starter')->first();

        $response = $this->actingAs($this->admin, 'super_admin')
            ->post(route('super-admin.tenants.store'), [
                'name' => 'New Tenant',
                'owner_name' => 'Owner User',
                'owner_email' => 'owner@test.com',
                'owner_password' => 'password123',
                'plan_id' => $plan->id,
            ]);

        $response->assertRedirect(route('super-admin.tenants.index'));

        $this->assertDatabaseHas('tenants', ['name' => 'New Tenant']);
        $this->assertDatabaseHas('users', ['email' => 'owner@test.com']);
        $this->assertDatabaseHas('plan_subscriptions', [
            'plan_id' => $plan->id,
            'status' => 'active',
        ]);
    }

    public function test_super_admin_can_view_tenant()
    {
        $tenant = Tenant::create(['name' => 'View Tenant']);

        $response = $this->actingAs($this->admin, 'super_admin')
            ->get(route('super-admin.tenants.show', $tenant));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('super-admin/tenants/show')
            ->where('tenant.name', 'View Tenant')
        );
    }

    public function test_super_admin_can_update_tenant()
    {
        $tenant = Tenant::create(['name' => 'Old Name']);

        $response = $this->actingAs($this->admin, 'super_admin')
            ->put(route('super-admin.tenants.update', $tenant), [
                'name' => 'New Name',
            ]);

        $response->assertRedirect(route('super-admin.tenants.index'));
        $this->assertDatabaseHas('tenants', ['id' => $tenant->id, 'name' => 'New Name']);
    }

    public function test_super_admin_can_list_subscriptions()
    {
        $tenant = Tenant::create(['name' => 'Sub Tenant']);
        $plan = Plan::first();
        Subscription::create([
            'tenant_id' => $tenant->id,
            'plan_id' => $plan->id,
            'starts_at' => now()->toDateString(),
            'expires_at' => now()->addMonth()->toDateString(),
            'status' => 'active',
        ]);

        $response = $this->actingAs($this->admin, 'super_admin')
            ->get(route('super-admin.subscriptions.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('super-admin/subscriptions/index')
            ->has('subscriptions.data', 1)
        );
    }

    public function test_super_admin_can_cancel_subscription()
    {
        $tenant = Tenant::create(['name' => 'Cancel Tenant']);
        $plan = Plan::first();
        $subscription = Subscription::create([
            'tenant_id' => $tenant->id,
            'plan_id' => $plan->id,
            'starts_at' => now()->toDateString(),
            'expires_at' => now()->addMonth()->toDateString(),
            'status' => 'active',
        ]);

        $response = $this->actingAs($this->admin, 'super_admin')
            ->post(route('super-admin.subscriptions.cancel', $subscription));

        $response->assertRedirect();
        $this->assertDatabaseHas('plan_subscriptions', [
            'id' => $subscription->id,
            'status' => 'cancelled',
        ]);
    }

    public function test_super_admin_can_list_payments()
    {
        $tenant = Tenant::create(['name' => 'Pay Tenant']);
        Payment::create([
            'tenant_id' => $tenant->id,
            'amount' => 29.00,
            'currency' => 'USD',
            'status' => 'completed',
            'paid_at' => now(),
        ]);

        $response = $this->actingAs($this->admin, 'super_admin')
            ->get(route('super-admin.payments.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('super-admin/payments/index')
            ->has('payments.data', 1)
        );
    }

    public function test_unauthenticated_access_to_super_admin_redirected()
    {
        $response = $this->get(route('super-admin.dashboard'));

        $response->assertRedirect();
    }
}
