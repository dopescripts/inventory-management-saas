<?php

namespace Tests\Feature\Auth;

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Fortify\Features;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->skipUnlessFortifyHas(Features::registration());

        $this->artisan('db:seed', ['--class' => 'RoleSeeder']);
    }

    public function test_registration_screen_can_be_rendered()
    {
        $response = $this->get(route('register'));

        $response->assertOk();
    }

    public function test_new_users_can_register()
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'company_name' => 'Acme Inventory',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $user = User::where('email', 'test@example.com')->firstOrFail();

        $this->assertSame('Acme Inventory', $user->tenant->name);
        $this->assertTrue($user->hasRole('owner'));
        $this->assertTrue($user->tenant->hasActiveSubscription());
        $this->assertSame('Free Trial', $user->tenant->activeSubscription->plan->name);
        $this->assertSame('trial', $user->tenant->activeSubscription->status);
        $this->assertDatabaseCount((new Tenant)->getTable(), 1);
        $this->assertDatabaseCount((new Subscription)->getTable(), 1);
        $this->assertDatabaseHas((new Plan)->getTable(), [
            'name' => 'Free Trial',
            'max_warehouses' => 1,
            'max_items' => 50,
            'max_orders' => 20,
            'has_whatsapp' => false,
        ]);
    }
}
