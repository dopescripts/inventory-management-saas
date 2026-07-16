<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCurrencyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['owner', 'manager']);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'default_currency_id' => ['required', Rule::exists('currencies', 'id')->where('is_active', true)],
            'billing_address' => ['nullable', 'string', 'max:500'],
            'billing_phone' => ['nullable', 'string', 'max:50'],
            'billing_email' => ['nullable', 'email', 'max:255'],
            'tax_id' => ['nullable', 'string', 'max:100'],
        ];
    }
}
