<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUploadRequest extends FormRequest
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

            'jenis_dokumen' => 'required|in:foto,ktm,cv,sertifikat',

            'original_name' => 'required|string|max:255',

            'file_path' => 'required|string|max:255',

            'mime_type' => 'required|string|max:100',

            'ukuran_file' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'required' => ':attribute wajib diisi.',
            'exists' => ':attribute tidak ditemukan.',
            'string' => ':attribute harus berupa teks.',
            'integer' => ':attribute harus berupa angka.',
            'max' => ':attribute maksimal :max karakter.',
            'min' => ':attribute minimal :min.',
            'in' => ':attribute tidak valid.',
        ];
    }

    public function attributes(): array
    {
        return [
            'peserta_id' => 'Peserta',
            'jenis_dokumen' => 'Jenis Dokumen',
            'original_name' => 'Nama File',
            'file_path' => 'Lokasi File',
            'mime_type' => 'Tipe File',
            'ukuran_file' => 'Ukuran File',
        ];
    }
}