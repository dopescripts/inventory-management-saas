<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        return DB::transaction(function () use ($input): User {
            $tenant = Tenant::create([
                'name' => $input['company_name'],
            ]);

            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
                'tenant_id' => $tenant->id,
            ]);

            $plan = Plan::firstOrCreate(
                ['name' => 'Free Trial'],
                [
                    'max_warehouses' => 1,
                    'max_items' => 50,
                    'max_orders' => 20,
                    'has_whatsapp' => false,
                    'price' => 0,
                    'trial_days' => 14,
                ],
            );

            Subscription::create([
                'tenant_id' => $tenant->id,
                'plan_id' => $plan->id,
                'starts_at' => now()->toDateString(),
                'expires_at' => now()->addDays($plan->trial_days)->toDateString(),
                'status' => 'trial',
            ]);

            setPermissionsTeamId($tenant->id);
            $user->assignRole('owner');

            Cache::forget('spatie.permission.cache');

            return $user;
        });
    }
}
