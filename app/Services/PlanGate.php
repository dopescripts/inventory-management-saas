<?php

namespace App\Services;

use App\Models\Tenant;

class PlanGate
{
    /**
     * Check if the tenant can create another warehouse.
     */
    public function canCreateWarehouse(Tenant $tenant): bool
    {
        $plan = $tenant->activeSubscription?->plan;
        
        if (!$plan) {
            return false;
        }

        if ($plan->max_warehouses === -1) {
            return true;
        }

        // Note: Count will be implemented once Warehouse model is created
        $currentCount = method_exists($tenant, 'warehouses') ? $tenant->warehouses()->count() : 0;

        return $currentCount < $plan->max_warehouses;
    }

    /**
     * Check if the tenant can create another item/product.
     */
    public function canCreateProduct(Tenant $tenant): bool
    {
        $plan = $tenant->activeSubscription?->plan;

        if (!$plan) {
            return false;
        }

        if ($plan->max_items === -1) {
            return true;
        }

        // Note: Count will be implemented once Item/Product model is created
        $currentCount = method_exists($tenant, 'items') ? $tenant->items()->count() : 0;

        return $currentCount < $plan->max_items;
    }

    /**
     * Check if the tenant can process more orders this month.
     */
    public function canProcessOrder(Tenant $tenant): bool
    {
        $plan = $tenant->activeSubscription?->plan;

        if (!$plan) {
            return false;
        }

        if ($plan->max_orders === -1) {
            return true;
        }

        // Note: Monthly count will be implemented once Order model is created
        $currentCount = 0; 

        return $currentCount < $plan->max_orders;
    }

    /**
     * Check if the tenant has access to a specific feature.
     */
    public function hasFeature(Tenant $tenant, string $feature): bool
    {
        $plan = $tenant->activeSubscription?->plan;

        if (!$plan) {
            return false;
        }

        return match ($feature) {
            'whatsapp' => (bool) $plan->has_whatsapp,
            default => false,
        };
    }
}
