<?php

namespace App\Http\Requests\Purchase;

use App\Enums\PurchaseStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePurchaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update_purchases')
            && $this->route('purchase_order')->status === PurchaseStatus::Draft;
    }

    public function rules(): array
    {
        return [
            'vendor_id' => [
                'required',
                Rule::exists('vendors', 'id'),
            ],

            'expected_date' => [
                'nullable',
                'date',
            ],

            'discount' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'tax' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'shipping' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'items' => [
                'required',
                'array',
                'min:1',
            ],

            'items.*.item_id' => [
                'required',
                'distinct',
                Rule::exists('items', 'id'),
            ],

            'items.*.quantity_ordered' => [
                'required',
                'numeric',
                'gt:0',
            ],

            'items.*.unit_cost' => [
                'required',
                'numeric',
                'min:0',
            ],

            'items.*.discount' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'items.*.tax' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'items.*.remarks' => [
                'nullable',
                'string',
                'max:500',
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'items.*.item_id' => 'item',
            'items.*.quantity_ordered' => 'quantity',
            'items.*.unit_cost' => 'unit cost',
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'Please add at least one item.',
            'items.*.item_id.distinct' => 'An item can only be added once.',
            'items.*.quantity_ordered.gt' => 'Quantity must be greater than zero.',
        ];
    }

    protected function prepareForValidation(): void
    {
        if (! $this->filled('items')) {
            $this->merge(['items' => []]);
        }
    }
}
