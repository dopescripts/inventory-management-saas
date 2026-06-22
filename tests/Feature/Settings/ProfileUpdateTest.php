<?php

namespace Tests\Feature\Settings;

use App\Http\Middleware\SetTenantForPermissions;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProfileUpdateTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed the roles and permissions required for testing
        $this->artisan('db:seed', ['--class' => 'RoleSeeder']);
        $this->artisan('db:seed', ['--class' => 'PermissionSeeder']);
    }

    public function test_profile_page_is_displayed()
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

        $response = $this
            ->actingAs($user)
            ->get(route('profile.edit'));

        $response
            ->assertOk()
            ->assertInertia(
                fn(Assert $page) => $page
                    ->where('companyName', 'Acme Inventory')
                    ->where('auth.tenant.name', 'Acme Inventory')
                    ->where('auth.tenant.subscription.status', 'trial')
                    ->where('auth.tenant.subscription.plan.name', 'Free Trial')
            );
    }

    public function test_profile_information_can_be_updated_owner()
    {
        $tenant = Tenant::create(['name' => 'Old Company']);
        $user = User::factory()->create(['tenant_id' => $tenant->id]);
        setPermissionsTeamId($tenant->id);
        $user->assignRole('owner');

        $response = $this
            ->actingAs($user)
            ->patch(route('profile.update'), [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'company_name' => 'New Company',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertNull($user->email_verified_at);
        $this->assertSame('New Company', $tenant->refresh()->name);
    }

    public function test_profile_information_can_be_updated_not_owner()
    {
        $tenant = Tenant::create(['name' => 'Old Company']);
        $user = User::factory()->create(['tenant_id' => $tenant->id]);
        setPermissionsTeamId($tenant->id);
        $user->assignRole('staff');

        $response = $this
            ->actingAs($user)
            ->patch(route('profile.update'), [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'company_name' => 'New Company',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertNull($user->email_verified_at);
        $this->assertNotSame('New Company', $tenant->refresh()->name);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged()
    {
        $tenant = Tenant::create(['name' => 'Acme Inventory']);
        $user = User::factory()->create(['tenant_id' => $tenant->id]);

        $response = $this
            ->actingAs($user)
            ->patch(route('profile.update'), [
                'name' => 'Test User',
                'email' => $user->email,
                'company_name' => 'Acme Inventory',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_user_can_delete_their_account()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete(route('profile.destroy'), [
                'password' => 'password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('home'));

        $this->assertGuest();
        $this->assertNull($user->fresh());
    }

    public function test_correct_password_must_be_provided_to_delete_account()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from(route('profile.edit'))
            ->delete(route('profile.destroy'), [
                'password' => 'wrong-password',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect(route('profile.edit'));

        $this->assertNotNull($user->fresh());
    }
}
