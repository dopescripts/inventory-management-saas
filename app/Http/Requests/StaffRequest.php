<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('owner');
    }

    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'in:manager,staff'],
        ];

        if ($this->isMethod('POST')) {
            $rules['email'] = ['required', 'string', 'email', 'max:255', 'unique:users'];
        } else {
            $rules['email'] = ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$this->route('staff')->id];
        }

        return $rules;
    }
}
