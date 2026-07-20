<?php

namespace Database\Seeders;

use App\Models\Divisi;
use Illuminate\Database\Seeder;

class DivisiSeeder extends Seeder
{
    public function run(): void
    {
        $divisi = [
            ['nama' => 'Bakat Minat', 'deskripsi' => 'Divisi yang mengembangkan minat dan bakat mahasiswa.', 'kuota' => 10],
            ['nama' => 'Danus', 'deskripsi' => 'Divisi dana dan usaha.', 'kuota' => 10],
            ['nama' => 'Humas', 'deskripsi' => 'Divisi hubungan masyarakat.', 'kuota' => 10],
            ['nama' => 'Kaderisasi', 'deskripsi' => 'Divisi yang mengelola kaderisasi anggota.', 'kuota' => 10],
            ['nama' => 'Litbang', 'deskripsi' => 'Divisi penelitian dan pengembangan.', 'kuota' => 10],
            ['nama' => 'Medinfo', 'deskripsi' => 'Divisi media dan informasi.', 'kuota' => 10],
            ['nama' => 'Pendidikan', 'deskripsi' => 'Divisi pendidikan dan pelatihan.', 'kuota' => 10],
            ['nama' => 'Sospo', 'deskripsi' => 'Divisi sosial dan politik.', 'kuota' => 10],
        ];

        foreach ($divisi as $d) {
            Divisi::create($d);
        }
    }
}
