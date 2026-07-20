<?php

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OnboardingTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Tenant $tenant;

    protected function setUp(): void
    {
        parent::setUp();

        $this->artisan('db:seed', ['--class' => 'RoleSeeder']);
        $this->artisan('db:seed', ['--class' => 'PlanSeeder']);

        $this->tenant = Tenant::create(['name' => 'Test Company']);
        $this->user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'tenant_id' => $this->tenant->id,
        ]);

        setPermissionsTeamId($this->tenant->id);
        $this->user->assignRole('owner');
    }

    public function test_unauthenticated_user_cannot_access_onboarding()
    {
        $response = $this->get(route('onboarding.show'));

        $response->assertRedirect(route('login'));
    }

    public function test_onboarding_page_renders_for_user_without_completed_onboarding()
    {
        $this->user->update(['email_verified_at' => now()]);

        $response = $this->actingAs($this->user)->get(route('onboarding.show'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('onboarding')
            ->has('plans')
            ->has('tenant')
            ->has('step')
        );
    }

    public function test_user_without_onboarding_is_redirected_from_dashboard()
    {
        $this->user->update(['email_verified_at' => now()]);

        Subscription::create([
            'tenant_id' => $this->tenant->id,
            'plan_id' => Plan::where('name', 'Free Trial')->first()->id,
            'starts_at' => now()->toDateString(),
            'expires_at' => now()->addDays(14)->toDateString(),
            'status' => 'trial',
        ]);

        $response = $this->actingAs($this->user)->get(route('dashboard'));

        $response->assertRedirect(route('onboarding.show'));
    }

    public function test_user_with_completed_onboarding_can_access_dashboard()
    {
        $this->user->update([
            'email_verified_at' => now(),
            'onboarding_completed_at' => now(),
        ]);

        Subscription::create([
            'tenant_id' => $this->tenant->id,
            'plan_id' => Plan::where('name', 'Free Trial')->first()->id,
            'starts_at' => now()->toDateString(),
            'expires_at' => now()->addDays(14)->toDateString(),
            'status' => 'trial',
        ]);

        $response = $this->actingAs($this->user)->get(route('dashboard'));

        $response->assertOk();
    }

    public function test_company_details_can_be_saved()
    {
        $this->user->update(['email_verified_at' => now()]);

        $response = $this->actingAs($this->user)->post(route('onboarding.company'), [
            'name' => 'Updated Company',
            'billing_address' => '123 Main St',
            'billing_phone' => '+1234567890',
            'billing_email' => 'billing@test.com',
            'tax_id' => 'TAX123',
        ]);

        $response->assertRedirect(route('onboarding.show'));

        $this->tenant->refresh();
        $this->assertSame('Updated Company', $this->tenant->name);
        $this->assertSame('123 Main St', $this->tenant->billing_address);
        $this->assertSame('billing@test.com', $this->tenant->billing_email);
    }

    public function test_plan_can_be_selected()
    {
        $this->user->update(['email_verified_at' => now()]);
        $plan = Plan::where('name', 'Starter')->first();

        $response = $this->actingAs($this->user)->post(route('onboarding.plan'), [
            'plan_id' => $plan->id,
        ]);

        $response->assertRedirect(route('onboarding.show'));
        $this->assertSame($plan->id, session('onboarding_plan_id'));
    }

    public function test_payment_completes_onboarding_for_free_plan()
    {
        $this->user->update(['email_verified_at' => now()]);
        $plan = Plan::where('name', 'Free Trial')->first();

        $response = $this->actingAs($this->user)
            ->withSession(['onboarding_plan_id' => $plan->id])
            ->post(route('onboarding.payment'));

        $response->assertRedirect(route('dashboard'));

        $this->user->refresh();
        $this->assertNotNull($this->user->onboarding_completed_at);
        $this->assertDatabaseHas('payments', [
            'tenant_id' => $this->tenant->id,
            'status' => 'completed',
        ]);
    }

    public function test_payment_completes_onboarding_for_paid_plan()
    {
        $this->user->update(['email_verified_at' => now()]);
        $plan = Plan::where('name', 'Starter')->first();

        $response = $this->actingAs($this->user)
            ->withSession(['onboarding_plan_id' => $plan->id])
            ->post(route('onboarding.payment'), [
                'card_number' => '4242424242424242',
                'expiry' => '12/28',
                'cvv' => '123',
                'card_holder' => 'Test User',
            ]);

        $response->assertRedirect(route('dashboard'));

        $this->user->refresh();
        $this->assertNotNull($this->user->onboarding_completed_at);
        $this->assertDatabaseHas('payments', [
            'tenant_id' => $this->tenant->id,
            'amount' => $plan->price,
            'status' => 'completed',
        ]);
        $this->assertDatabaseHas('plan_subscriptions', [
            'tenant_id' => $this->tenant->id,
            'plan_id' => $plan->id,
            'status' => 'active',
        ]);
    }

    public function test_payment_without_plan_redirects_back()
    {
        $this->user->update(['email_verified_at' => now()]);

        $response = $this->actingAs($this->user)->post(route('onboarding.payment'));

        $response->assertRedirect(route('onboarding.show'));
    }
}
