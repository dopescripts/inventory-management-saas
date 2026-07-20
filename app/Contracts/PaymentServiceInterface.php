<?php

namespace App\Contracts;

use App\DTOs\PaymentResult;
use App\Models\Plan;
use App\Models\Tenant;

interface PaymentServiceInterface
{
    /**
     * @param  array<string, mixed>  $paymentDetails
     */
    public function charge(Tenant $tenant, Plan $plan, array $paymentDetails): PaymentResult;
}
