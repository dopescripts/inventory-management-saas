<?php

namespace Tests\Feature;

use App\Mail\StaffInvitationMail;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class StaffManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed the roles and permissions required for testing
        $this->artisan('db:seed', ['--class' => 'RoleSeeder']);
        $this->artisan('db:seed', ['--class' => 'PermissionSeeder']);
    }

    public function test_owner_can_view_staff_list(): void
    {
        $tenant = Tenant::create(['name' => 'Test Tenant']);
        $owner = User::factory()->create(['tenant_id' => $tenant->id]);

        setPermissionsTeamId($tenant->id);
        $owner->assignRole('owner');

        $response = $this->actingAs($owner)->get(route('staff.index'));

        $response->assertStatus(200);
    }

    public function test_staff_cannot_view_staff_list(): void
    {
        $tenant = Tenant::create(['name' => 'Test Tenant']);
        $staff = User::factory()->create(['tenant_id' => $tenant->id]);

        setPermissionsTeamId($tenant->id);
        $staff->assignRole('staff');

        $response = $this->actingAs($staff)->get(route('staff.index'));

        $response->assertStatus(403);
    }

    public function test_owner_can_invite_new_staff(): void
    {
        Mail::fake();

        $tenant = Tenant::create(['name' => 'Test Tenant']);
        $owner = User::factory()->create(['tenant_id' => $tenant->id]);

        setPermissionsTeamId($tenant->id);
        $owner->assignRole('owner');

        $response = $this->actingAs($owner)->post(route('staff.store'), [
            'name' => 'New Manager',
            'email' => 'manager@test.com',
            'role' => 'manager',
        ]);

        $response->assertRedirect(route('staff.index'));

        $this->assertDatabaseHas('users', [
            'email' => 'manager@test.com',
            'tenant_id' => $tenant->id,
        ]);

        $newStaff = User::where('email', 'manager@test.com')->first();

        $this->assertTrue($newStaff->hasRole('manager'));

        Mail::assertSent(StaffInvitationMail::class, function ($mail) use ($newStaff) {
            return $mail->hasTo($newStaff->email);
        });
    }

    public function test_owner_cannot_modify_staff_from_another_tenant(): void
    {
        $tenantA = Tenant::create(['name' => 'Tenant A']);
        $ownerA = User::factory()->create(['tenant_id' => $tenantA->id]);
        setPermissionsTeamId($tenantA->id);
        $ownerA->assignRole('owner');

        $tenantB = Tenant::create(['name' => 'Tenant B']);
        $staffB = User::factory()->create(['tenant_id' => $tenantB->id]);
        setPermissionsTeamId($tenantB->id);
        $staffB->assignRole('staff');

        $response = $this->actingAs($ownerA)->get(route('staff.edit', $staffB));
        $response->assertStatus(404);

        $response = $this->actingAs($ownerA)->put(route('staff.update', $staffB), [
            'name' => 'Hacked Name',
            'email' => 'hacked@test.com',
            'role' => 'manager',
        ]);
        $response->assertStatus(404);
    }
}
