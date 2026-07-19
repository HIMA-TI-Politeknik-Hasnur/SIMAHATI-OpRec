<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreUploadRequest extends FormRequest
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

            // File asli wajib ada saat upload baru.
            // foto/ktm: hanya gambar; cv/sertifikat: pdf atau gambar.
            // Batas ukuran: foto & ktm 2MB, cv & sertifikat 5MB.
            'file' => [
                'required',
                'file',
                function (string $attribute, mixed $value, \Closure $fail) {
                    $jenis = $this->input('jenis_dokumen');

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
            'required'      => ':attribute wajib diisi.',
            'exists'        => ':attribute tidak ditemukan.',
            'in'            => ':attribute tidak valid.',
            'file.required' => 'File wajib diunggah.',
            'file.file'     => 'Upload harus berupa file.',
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
