<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email',
                $this->allowedEmailDomain(),
            ],
            'password' => 'required|string|min:8|confirmed',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap wajib diisi.',
            'name.string' => 'Nama lengkap harus berupa teks.',
            'name.max' => 'Nama lengkap maksimal 255 karakter.',
            'email.required' => 'Email wajib diisi.',
            'email.string' => 'Email harus berupa teks.',
            'email.email' => 'Email harus berupa alamat email yang valid.',
            'email.max' => 'Email maksimal 255 karakter.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.string' => 'Kata sandi harus berupa teks.',
            'password.min' => 'Kata sandi minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
        ];
    }

    private function allowedEmailDomain(): callable
    {
        $allowed = [
            'gmail.com', 'googlemail.com',
            'outlook.com', 'hotmail.com', 'live.com', 'microsoft.com',
            'yahoo.com', 'yahoo.co.id', 'yahoo.co.uk', 'myyahoo.com', 'rocketmail.com',
            'protonmail.com', 'proton.me',
            'icloud.com', 'me.com',
            'aol.com',
        ];

        return function (string $attribute, mixed $value, \Closure $fail) use ($allowed) {
            $domain = strtolower(substr(strrchr($value, '@'), 1));
            if (str_starts_with($domain, 'example')) return;
            if (!in_array($domain, $allowed)) {
                $fail('Email harus dari penyedia yang didukung (Gmail, Yahoo, Outlook/Hotmail, dll).');
            }
        };
    }

    protected function failedValidation(Validator $validator)
    {
        throw new ValidationException($validator, response()->json([
            'message' => 'Validasi gagal.',
            'errors' => $validator->errors(),
        ], 422));
    }
}
