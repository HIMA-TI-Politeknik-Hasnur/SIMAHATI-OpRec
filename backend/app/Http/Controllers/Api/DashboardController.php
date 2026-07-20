<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Interview;
use App\Models\Pengumuman;
use App\Models\Role;
use App\Models\User;
use App\Models\Divisi;

class DashboardController extends Controller
{
    public function stats()
    {
        $pendaftarRole = Role::where('name', 'pendaftar')->first();
        $totalPendaftar = $pendaftarRole ? $pendaftarRole->users()->count() : 0;

        $lolosAdministrasi = User::where('registration_status', 'lolos_administrasi')->count();
        $lolosWawancara = User::where('registration_status', 'lolos_wawancara')->count();

        $adminRoles = ['super_admin', 'admin_oprec'];
        $totalAdmin = User::whereHas('roles', function ($q) use ($adminRoles) {
            $q->whereIn('name', $adminRoles);
        })->count();

        $totalDivisi = 0;
        if (class_exists('App\Models\Divisi')) {
            $totalDivisi = Divisi::count();
        }

        $totalInterview = Interview::count();
        $totalPengumuman = Pengumuman::count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_pendaftar' => $totalPendaftar,
                'lolos_administrasi' => $lolosAdministrasi,
                'lolos_wawancara' => $lolosWawancara,
                'total_divisi' => $totalDivisi,
                'total_admin' => $totalAdmin,
                'total_interview' => $totalInterview,
                'total_pengumuman' => $totalPengumuman,
            ],
        ]);
    }
}
