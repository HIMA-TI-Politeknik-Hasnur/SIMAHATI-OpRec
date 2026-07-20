<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Interview;
use App\Models\Peserta;
use App\Models\Pengumuman;
use App\Models\User;
use App\Models\Divisi;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalPendaftar = Peserta::count();

        $lolosAdministrasi = Peserta::where('status_verifikasi', 'verified')->count();
        $lolosWawancara = Peserta::where('status_seleksi', 'accepted')->count();

        $totalAdmin = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['Super Admin', 'Admin']);
        })->count();

        $totalDivisi = Divisi::count();
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
