<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Plan::create([
            'name' => 'Free Trial',
            'max_warehouses' => 1,
            'max_items' => 50,
            'max_orders' => 20,
            'has_whatsapp' => false,
            'price' => 0.00,
            'trial_days' => 14,
        ]);

        Plan::create([
            'name' => 'Starter Plan',
            'max_warehouses' => 2,
            'max_items' => 500,
            'max_orders' => 200,
            'has_whatsapp' => false,
            'price' => 29.00,
            'trial_days' => 0,
        ]);

        Plan::create([
            'name' => 'Growth Plan',
            'max_warehouses' => 5,
            'max_items' => 5000,
            'max_orders' => -1,
            'has_whatsapp' => true,
            'price' => 99.00,
            'trial_days' => 0,
        ]);

        Plan::create([
            'name' => 'Enterprise Plan',
            'max_warehouses' => -1,
            'max_items' => -1,
            'max_orders' => -1,
            'has_whatsapp' => true,
            'price' => 299.00,
            'trial_days' => 0,
        ]);
    }
}
