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
            'peserta_id' => 'sometimes|exists:peserta,id',

            'jenis_dokumen' => 'sometimes|in:foto,ktm,cv,sertifikat',

            // File bersifat opsional saat update — hanya wajib kalau dikirim.
            'file' => [
                'nullable',
                'file',
                function (string $attribute, mixed $value, \Closure $fail) {
                    if ($value === null) {
                        return;
                    }

                    // Ambil jenis_dokumen dari request atau dari record yang sedang diupdate.
                    $jenis = $this->input('jenis_dokumen') ?? $this->route('upload')?->jenis_dokumen;

                    if (in_array($jenis, ['foto', 'ktm'])) {
                        $allowedMimes = ['jpeg', 'jpg', 'png', 'webp'];
                        $maxKb = 2048; // 2 MB
                    } else {
                        // cv, sertifikat
                        $allowedMimes = ['pdf', 'jpeg', 'jpg', 'png'];
                        $maxKb = 5120; // 5 MB
                    }

                    if ($value->getSize() > $maxKb * 1024) {
                        $fail("Ukuran file maksimal {$maxKb} KB.");
                        return;
                    }

                    $ext = strtolower($value->getClientOriginalExtension());
                    if (! in_array($ext, $allowedMimes)) {
                        $fail('Format file tidak didukung. Ekstensi yang diizinkan: ' . implode(', ', $allowedMimes) . '.');
                    }
                },
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'exists'           => ':attribute tidak ditemukan.',
            'in'               => ':attribute tidak valid.',
            'file.file'        => 'Upload harus berupa file.',
        ];
    }

    public function attributes(): array
    {
        return [
            'peserta_id'    => 'Peserta',
            'jenis_dokumen' => 'Jenis Dokumen',
            'file'          => 'File',
        ];
    }
}
