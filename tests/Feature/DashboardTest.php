<?php

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $tenant = Tenant::create(['name' => 'Acme Inventory']);
        $user = User::factory()->create(['tenant_id' => $tenant->id]);
        $plan = Plan::create([
            'name' => 'Free Trial',
            'max_warehouses' => 1,
            'max_items' => 50,
            'max_orders' => 20,
            'has_whatsapp' => false,
            'price' => 0,
            'trial_days' => 14,
        ]);

        Subscription::create([
            'tenant_id' => $tenant->id,
            'plan_id' => $plan->id,
            'starts_at' => now()->toDateString(),
            'expires_at' => now()->addDays(14)->toDateString(),
            'status' => 'trial',
        ]);

        setPermissionsTeamId($tenant->id);
        Role::findOrCreate('owner', 'web');
        $user->assignRole('owner');

        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('auth.tenant.name', 'Acme Inventory')
                ->where('auth.tenant.subscription.status', 'trial')
                ->where('auth.tenant.subscription.plan.name', 'Free Trial')
            );
    }
}
