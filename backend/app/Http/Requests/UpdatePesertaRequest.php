<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePesertaRequest extends FormRequest
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
        $peserta = $this->route('peserta');

        return [
            'nama_lengkap' => 'required|string|max:100',

            'nim' => [
                'required',
                'string',
                'max:20',
                Rule::unique('peserta', 'nim')->ignore($peserta),
            ],

            'semester' => 'required|integer|min:1|max:14',

            'program_studi' => 'required|string|max:100',

            'angkatan' => 'required|digits:4',

            'email' => [
                'required',
                'email',
                'max:100',
                Rule::unique('peserta', 'email')->ignore($peserta),
            ],

            'nomor_hp' => 'required|string|max:20',

            'alamat' => 'required|string',

            'pengalaman_organisasi' => 'nullable|string',

            'skill' => 'nullable|string',

            'prestasi' => 'nullable|string',

            'pilihan_divisi_1' => 'required|integer',

            'pilihan_divisi_2' => 'nullable|integer',

            'motivasi' => 'required|string',

            'kontribusi' => 'required|string',

            'harapan' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'required' => ':attribute wajib diisi.',
            'email' => ':attribute harus berupa alamat email yang valid.',
            'unique' => ':attribute sudah terdaftar.',
            'integer' => ':attribute harus berupa angka.',
            'string' => ':attribute harus berupa teks.',
            'digits' => ':attribute harus terdiri dari :digits digit.',
            'exists' => ':attribute tidak ditemukan.',
            'max' => ':attribute maksimal :max karakter.',
            'min' => ':attribute minimal :min.',
        ];
    }

    public function attributes(): array
    {
        return [
            'user_id' => 'User',
            'nama_lengkap' => 'Nama Lengkap',
            'nim' => 'NIM',
            'semester' => 'Semester',
            'program_studi' => 'Program Studi',
            'angkatan' => 'Angkatan',
            'email' => 'Email',
            'nomor_hp' => 'Nomor HP',
            'alamat' => 'Alamat',
            'pengalaman_organisasi' => 'Pengalaman Organisasi',
            'skill' => 'Skill',
            'prestasi' => 'Prestasi',
            'pilihan_divisi_1' => 'Pilihan Divisi 1',
            'pilihan_divisi_2' => 'Pilihan Divisi 2',
            'motivasi' => 'Motivasi',
            'kontribusi' => 'Kontribusi',
            'harapan' => 'Harapan',
        ];
    }
}
