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

        $pendingVerifikasi  = Peserta::where('status_verifikasi', 'pending')->count();
        $lolosAdministrasi  = Peserta::where('status_verifikasi', 'verified')->count();
        $ditolakAdministrasi = Peserta::where('status_verifikasi', 'rejected')->count();

        $dalamInterview = Peserta::where('status_seleksi', 'interview')->count();
        $lolosSeleksi   = Peserta::where('status_seleksi', 'accepted')->count();
        $ditolakSeleksi = Peserta::where('status_seleksi', 'rejected')->count();

        $totalAdmin = User::whereHas('roles', function ($q) {
            $q->whereIn('slug', ['super_admin', 'admin']);
        })->count();

        $totalDivisi  = Divisi::count();
        $totalInterview = Interview::count();
        $totalPengumuman = Pengumuman::count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_pendaftar'      => $totalPendaftar,
                'pending_verifikasi'   => $pendingVerifikasi,
                'lolos_administrasi'   => $lolosAdministrasi,
                'ditolak_administrasi' => $ditolakAdministrasi,
                'dalam_interview'      => $dalamInterview,
                'lolos_seleksi'        => $lolosSeleksi,
                'ditolak_seleksi'      => $ditolakSeleksi,
                'total_divisi'         => $totalDivisi,
                'total_admin'          => $totalAdmin,
                'total_interview'      => $totalInterview,
                'total_pengumuman'     => $totalPengumuman,
            ],
        ]);
    }
}
