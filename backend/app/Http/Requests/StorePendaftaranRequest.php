<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePendaftaranRequest extends FormRequest
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
        return [
            'peserta_id' => 'required|exists:peserta,id',

            'tanggal_daftar' => 'nullable|date',

            'status' => 'required|in:draft,submitted,verified,rejected',

            'catatan_admin' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'required' => ':attribute wajib diisi.',
            'exists' => ':attribute tidak ditemukan.',
            'date' => ':attribute harus berupa tanggal yang valid.',
            'string' => ':attribute harus berupa teks.',
            'in' => ':attribute tidak valid.',
        ];
    }

    public function attributes(): array
    {
        return [
            'peserta_id' => 'Peserta',
            'tanggal_daftar' => 'Tanggal Daftar',
            'status' => 'Status',
            'catatan_admin' => 'Catatan Admin',
        ];
    }
}
