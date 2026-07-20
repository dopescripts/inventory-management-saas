<?php

namespace App\Http\Requests\SuperAdmin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class TenantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if ($this->isMethod('POST')) {
            return [
                'company_name' => ['required', 'string', 'max:255'],
                'owner_name' => ['required', 'string', 'max:255'],
                'owner_email' => ['required', 'email', 'unique:users,email'],
                'owner_password' => ['required', 'string', 'min:8'],
                'billing_email' => ['nullable', 'email', 'max:255'],
                'billing_phone' => ['nullable', 'string', 'max:50'],
                'billing_address' => ['nullable', 'string', 'max:500'],
                'plan_id' => ['nullable', 'exists:plans,id'],
            ];
        }

        return [
            'company_name' => ['required', 'string', 'max:255'],
            'billing_email' => ['nullable', 'email', 'max:255'],
            'billing_phone' => ['nullable', 'string', 'max:50'],
            'billing_address' => ['nullable', 'string', 'max:500'],
            'tax_id' => ['nullable', 'string', 'max:100'],
        ];
    }
}
