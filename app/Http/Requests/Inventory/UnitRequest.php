<?php

namespace App\Http\Requests\Inventory;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UnitRequest extends FormRequest
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
        $unitId = $this->route('unit')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'short_name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('units', 'short_name')
                    ->where('tenant_id', $tenantId)
                    ->ignore($unitId),
            ],
            'type' => ['required', 'string', Rule::in(['unit', 'weight', 'volume', 'length', 'area', 'time'])],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
