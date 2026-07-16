<?php

namespace App\Http\Requests\Purchase;

use App\Enums\PurchaseStatus;
use Illuminate\Foundation\Http\FormRequest;

class SubmitPurchaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('submit_purchases')
            && $this->route('purchase_order')->status === PurchaseStatus::Draft;
    }

    public function rules(): array
    {
        return [];
    }
}
