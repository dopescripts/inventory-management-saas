<?php

namespace App\Http\Requests\Purchase;

use App\Enums\PurchaseStatus;
use Illuminate\Foundation\Http\FormRequest;

class ApprovePurchaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('approve_purchases')
            && $this->route('purchase_order')->status === PurchaseStatus::Pending;
    }

    public function rules(): array
    {
        return [];
    }
}
