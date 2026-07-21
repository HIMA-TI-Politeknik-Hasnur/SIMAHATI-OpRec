<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pengumuman;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PengumumanController extends Controller
{
    public function index()
    {
        $pengumumans = Pengumuman::latest('published_at')->get();
        return response()->json([
            'success' => true,
            'data' => $pengumumans
        ]);
    }

    /**
     * Endpoint publik — hanya tampilkan yang sudah published (published_at <= sekarang).
     * Bisa diakses tanpa login oleh peserta dan pengunjung.
     */
    public function publik()
    {
        $pengumumans = Pengumuman::whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->latest('published_at')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $pengumumans,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'tipe' => 'in:info,warning,success,danger',
            'published_at' => 'nullable|date|after:2000-01-01'
        ]);

        $validated['created_by'] = Auth::id() ?? 1;

        $pengumuman = Pengumuman::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil dibuat.',
            'data' => $pengumuman
        ], 201);
    }

    public function show(Pengumuman $pengumuman)
    {
        return response()->json([
            'success' => true,
            'data' => $pengumuman
        ]);
    }

    public function update(Request $request, Pengumuman $pengumuman)
    {
        $validated = $request->validate([
            'judul' => 'sometimes|required|string|max:255',
            'isi' => 'sometimes|required|string',
            'tipe' => 'in:info,warning,success,danger',
            'published_at' => 'nullable|date|after:2000-01-01'
        ]);

        $pengumuman->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil diupdate.',
            'data' => $pengumuman
        ]);
    }

    public function destroy(Pengumuman $pengumuman)
    {
        $pengumuman->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil dihapus.'
        ]);
    }
}
