<?php

namespace App\Http\Requests\Purchase;

use App\Enums\PurchaseStatus;
use Illuminate\Foundation\Http\FormRequest;

class ClosePurchaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('close_purchases')
            && $this->route('purchase_order')->status === PurchaseStatus::Received;
    }

    public function rules(): array
    {
        return [];
    }
}
