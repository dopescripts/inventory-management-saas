<?php

namespace App\Http\Requests\Inventory;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $tenantId = $this->user()?->tenant_id;
        $itemId = $this->route('item')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'sku' => [
                'required',
                'string',
                'max:255',
                Rule::unique('items', 'sku')
                    ->where('tenant_id', $tenantId)
                    ->ignore($itemId),
            ],
            'barcode' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('items', 'barcode')
                    ->where('tenant_id', $tenantId)
                    ->ignore($itemId),
            ],
            'category_id' => [
                'nullable',
                'integer',
                Rule::exists('categories', 'id')->where('tenant_id', $tenantId),
            ],
            'brand_id' => [
                'nullable',
                'integer',
                Rule::exists('brands', 'id')->where('tenant_id', $tenantId),
            ],
            'unit_id' => [
                'required',
                'integer',
                Rule::exists('units', 'id')->where('tenant_id', $tenantId),
            ],
            'type' => ['required', 'string', Rule::in(['stock', 'service'])],
            'track_inventory' => ['nullable', 'boolean'],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
