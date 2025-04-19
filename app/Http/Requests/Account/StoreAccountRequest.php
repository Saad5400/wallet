<?php

namespace App\Http\Requests\Account;

use Illuminate\Foundation\Http\FormRequest;

class StoreAccountRequest extends FormRequest
{
    public function authorize()
    {
        // Ensure tenant context; adjust policy if needed
        return auth()->check();
    }

    public function rules()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'cashback_rate' => ['nullable', 'numeric'],
        ];
    }
}
