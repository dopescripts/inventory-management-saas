<?php

namespace App\Http\Requests\Purchase;

use App\Enums\PurchaseStatus;
use Illuminate\Foundation\Http\FormRequest;

class CancelPurchaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        $status = $this->route('purchase_order')->status;

        return $this->user()->can('cancel_purchases')
            && in_array($status, [
                PurchaseStatus::Draft,
                PurchaseStatus::Pending,
                PurchaseStatus::Approved,
            ]);
    }

    public function rules(): array
    {
        return [];
    }
}
