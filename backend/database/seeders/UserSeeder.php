<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use App\Models\Peserta;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@example.com',
                'password' => 'password',
                'role' => 'super_admin',
            ],
            [
                'name' => 'Admin OpRec',
                'email' => 'admin@example.com',
                'password' => 'password',
                'role' => 'admin',
            ],
            [
                'name' => 'Panitia OpRec',
                'email' => 'panitia@example.com',
                'password' => 'password',
                'role' => 'panitia',
            ],
            [
                'name' => 'Interviewer 1',
                'email' => 'interviewer@example.com',
                'password' => 'password',
                'role' => 'interviewer',
            ],
            [
                'name' => 'Peserta Demo',
                'email' => 'peserta@example.com',
                'password' => 'password',
                'role' => 'peserta',
            ],
        ];

        foreach ($users as $data) {
            $now = now();
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'email_verified_at' => $data['role'] !== 'peserta' ? $now : null,
            ]);

            $role = Role::where('slug', $data['role'])->first();
            if ($role) {
                $user->roles()->attach($role->id);
            }

            if ($data['role'] === 'peserta') {
                Peserta::create([
                    'user_id' => $user->id,
                    'nama_lengkap' => $data['name'],
                    'nim' => '20210800001',
                    'semester' => 6,
                    'program_studi' => 'Teknik Informatika',
                    'angkatan' => 2024,
                    'email' => $data['email'],
                    'nomor_hp' => '08123456789',
                    'alamat' => 'Alamat peserta demo',
                    'pilihan_divisi_1' => 1,
                    'motivasi' => 'Ingin mengembangkan diri dan berkontribusi di HMTI.',
                    'kontribusi' => 'Siap aktif dalam setiap kegiatan dan program kerja.',
                    'harapan' => 'Semoga bisa diterima dan memberikan dampak positif.',
                    'status_seleksi' => 'draft',
                ]);
            }
        }
    }
}
