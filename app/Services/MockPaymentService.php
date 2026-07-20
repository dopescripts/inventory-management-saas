<?php

namespace App\Services;

use App\Contracts\PaymentServiceInterface;
use App\DTOs\PaymentResult;
use App\Models\Plan;
use App\Models\Tenant;
use Illuminate\Support\Str;

class MockPaymentService implements PaymentServiceInterface
{
    /**
     * @param  array<string, mixed>  $paymentDetails
     */
    public function charge(Tenant $tenant, Plan $plan, array $paymentDetails): PaymentResult
    {
        return new PaymentResult(
            success: true,
            transactionId: 'mock_'.Str::random(24),
        );
    }
}
