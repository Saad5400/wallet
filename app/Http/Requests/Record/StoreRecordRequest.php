<?php

namespace App\Http\Requests\Record;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class StoreRecordRequest extends FormRequest
{
    /**
     * Prepare input data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->filled('occurred_at')) {
            $dt = $this->input('occurred_at');
            $this->merge([
                'occurred_at' => Carbon::parse($dt)->format('Y-m-d H:i:s'),
            ]);
        }
    }

    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in(['expense', 'income', 'transfer'])],
            'amount' => ['required', 'numeric'],
            'account_id' => ['required', 'integer', Rule::exists('accounts', 'id')->where('tenant_id', tenant()->id)],
            'category_id' => ['nullable', 'integer', Rule::exists('categories', 'id')->where('tenant_id', tenant()->id)],
            'sub_category_id' => ['nullable', 'integer', Rule::exists('sub_categories', 'id')->where('tenant_id', tenant()->id)],
            'occurred_at' => ['required', 'date'],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}