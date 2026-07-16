<?php

namespace App\Http\Requests\Purchase;

use App\Enums\PurchaseStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReceivePurchaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        $status = $this->route('purchase_order')->status;

        return $this->user()->can('receive_purchases')
            && in_array($status, [
                PurchaseStatus::Approved,
                PurchaseStatus::PartiallyReceived,
            ]);
    }

    public function rules(): array
    {
        return [
            'warehouse_id' => [
                'required',
                Rule::exists('warehouses', 'id'),
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

            'items.*.purchase_order_item_id' => [
                'required',
                Rule::exists('purchase_order_items', 'id'),
            ],

            'items.*.quantity' => [
                'required',
                'numeric',
                'gt:0',
            ],

            'items.*.location_id' => [
                'nullable',
                Rule::exists('locations', 'id'),
            ],

            'items.*.unit_cost' => [
                'nullable',
                'numeric',
                'min:0',
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'items.*.quantity' => 'receive quantity',
            'items.*.purchase_order_item_id' => 'item',
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'Please select at least one item to receive.',
            'items.*.quantity.gt' => 'Receive quantity must be greater than zero.',
        ];
    }
}
