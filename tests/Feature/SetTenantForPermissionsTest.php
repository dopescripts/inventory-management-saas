<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SetTenantForPermissionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_tenant_middleware_aborts_if_tenant_id_is_null(): void
    {
        $user = User::factory()->create(['tenant_id' => null]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertStatus(403);
    }
}
