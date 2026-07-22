<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Dashboard
            ['name' => 'Lihat Dashboard', 'slug' => 'view_dashboard', 'description' => 'Melihat dashboard utama'],

            // Peserta
            ['name' => 'Lihat Peserta', 'slug' => 'view_peserta', 'description' => 'Melihat data peserta'],
            ['name' => 'Tambah Peserta', 'slug' => 'create_peserta', 'description' => 'Menambahkan peserta baru'],
            ['name' => 'Edit Peserta', 'slug' => 'edit_peserta', 'description' => 'Mengubah data peserta'],
            ['name' => 'Hapus Peserta', 'slug' => 'delete_peserta', 'description' => 'Menghapus data peserta'],

            // Divisi
            ['name' => 'Lihat Divisi', 'slug' => 'view_divisi', 'description' => 'Melihat data divisi'],
            ['name' => 'Tambah Divisi', 'slug' => 'create_divisi', 'description' => 'Menambahkan divisi baru'],
            ['name' => 'Edit Divisi', 'slug' => 'edit_divisi', 'description' => 'Mengubah data divisi'],
            ['name' => 'Hapus Divisi', 'slug' => 'delete_divisi', 'description' => 'Menghapus data divisi'],

            // Interview
            ['name' => 'Lihat Interview', 'slug' => 'view_interview', 'description' => 'Melihat jadwal interview'],
            ['name' => 'Tambah Interview', 'slug' => 'create_interview', 'description' => 'Menambahkan jadwal interview'],
            ['name' => 'Edit Interview', 'slug' => 'edit_interview', 'description' => 'Mengubah jadwal interview'],
            ['name' => 'Hapus Interview', 'slug' => 'delete_interview', 'description' => 'Menghapus jadwal interview'],
            ['name' => 'Nilai Interview', 'slug' => 'grade_interview', 'description' => 'Memberikan penilaian interview'],

            // Pengumuman
            ['name' => 'Lihat Pengumuman', 'slug' => 'view_pengumuman', 'description' => 'Melihat pengumuman'],
            ['name' => 'Tambah Pengumuman', 'slug' => 'create_pengumuman', 'description' => 'Menambahkan pengumuman'],
            ['name' => 'Edit Pengumuman', 'slug' => 'edit_pengumuman', 'description' => 'Mengubah pengumuman'],
            ['name' => 'Hapus Pengumuman', 'slug' => 'delete_pengumuman', 'description' => 'Menghapus pengumuman'],

            // Role & Permission
            ['name' => 'Lihat Role', 'slug' => 'view_role', 'description' => 'Melihat data role'],
            ['name' => 'Tambah Role', 'slug' => 'create_role', 'description' => 'Menambahkan role baru'],
            ['name' => 'Edit Role', 'slug' => 'edit_role', 'description' => 'Mengubah data role'],
            ['name' => 'Hapus Role', 'slug' => 'delete_role', 'description' => 'Menghapus data role'],
            ['name' => 'Atur Permission', 'slug' => 'assign_permission', 'description' => 'Mengatur permission role'],

            // Penilaian
            ['name' => 'Lihat Penilaian', 'slug' => 'view_penilaian', 'description' => 'Melihat halaman penilaian interview'],

            // Profile
            ['name' => 'Edit Profil', 'slug' => 'edit_profile', 'description' => 'Mengubah profil sendiri'],
        ];

        foreach ($permissions as $perm) {
            Permission::create($perm);
        }

        $roles = [
            'Super Admin' => [
                'slug' => 'super_admin',
                'description' => 'Mengelola seluruh sistem dan konfigurasi aplikasi.',
                'permissions' => Permission::all()->pluck('id')->toArray(),
            ],
            'Admin' => [
                'slug' => 'admin',
                'description' => 'Mengelola seluruh proses Open Recruitment.',
                'permissions' => Permission::whereNotIn('slug', [
                    'delete_role', 'assign_permission',
                ])->pluck('id')->toArray(),
            ],
            'Panitia' => [
                'slug' => 'panitia',
                'description' => 'Membantu proses administrasi dan pengelolaan peserta.',
                'permissions' => Permission::whereIn('slug', [
                    'view_dashboard', 'view_peserta', 'create_peserta', 'edit_peserta',
                    'view_divisi', 'view_interview', 'view_pengumuman',
                    'edit_profile',
                ])->pluck('id')->toArray(),
            ],
            'Interviewer' => [
                'slug' => 'interviewer',
                'description' => 'Melakukan proses interview serta memberikan hasil penilaian.',
                'permissions' => Permission::whereIn('slug', [
                    'view_interview', 'grade_interview', 'view_peserta',
                    'view_penilaian', 'edit_profile',
                ])->pluck('id')->toArray(),
            ],
            'Peserta' => [
                'slug' => 'peserta',
                'description' => 'Melakukan pendaftaran dan mengikuti seluruh tahapan seleksi.',
                'permissions' => Permission::whereIn('slug', [
                    'edit_profile',
                ])->pluck('id')->toArray(),
            ],
        ];

        foreach ($roles as $name => $data) {
            $role = Role::create([
                'name' => $name,
                'slug' => $data['slug'],
                'description' => $data['description'],
                'guard_name' => 'web',
            ]);
            $role->permissions()->sync($data['permissions']);
        }
    }
}
