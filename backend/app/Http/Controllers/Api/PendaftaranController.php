<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePendaftaranRequest;
use App\Http\Requests\UpdatePendaftaranRequest;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;

class PendaftaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pendaftaran = Pendaftaran::with([
            'peserta',
        ])->get();

        return response()->json([
            'success' => true,
            'message' => 'Data pendaftaran berhasil diambil.',
            'data' => $pendaftaran,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePendaftaranRequest $request)
    {
        $data = $request->validated();
        $pendaftaran = Pendaftaran::firstOrCreate(
            ['peserta_id' => $data['peserta_id']],
            $data
        );

        $created = $pendaftaran->wasRecentlyCreated;
        return response()->json([
            'success' => true,
            'message' => $created ? 'Data pendaftaran berhasil ditambahkan.' : 'Data pendaftaran sudah ada.',
            'data' => $pendaftaran,
        ], $created ? 201 : 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Pendaftaran $pendaftaran)
    {
        $pendaftaran->load([
            'peserta',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Detail pendaftaran berhasil diambil.',
            'data' => $pendaftaran,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePendaftaranRequest $request, Pendaftaran $pendaftaran)
    {
        $pendaftaran->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Data pendaftaran berhasil diperbarui.',
            'data' => $pendaftaran,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pendaftaran $pendaftaran)
    {
        $pendaftaran->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data pendaftaran berhasil dihapus.',
        ]);
    }

    /**
     * Memperbarui status pendaftaran oleh admin.
     *
     * PATCH /pendaftaran/{pendaftaran}/status
     *
     * Body JSON:
     *   - status        : draft|submitted|verified|rejected  (wajib)
     *   - catatan_admin : string                             (opsional)
     */
    public function updateStatus(Request $request, Pendaftaran $pendaftaran)
    {
        $validated = $request->validate([
            'status'        => 'required|in:draft,submitted,verified,rejected',
            'catatan_admin' => 'nullable|string',
        ], [
            'status.required' => 'Status wajib diisi.',
            'status.in'       => 'Status tidak valid. Pilihan: draft, submitted, verified, rejected.',
            'catatan_admin.string' => 'Catatan admin harus berupa teks.',
        ]);

        $data = ['status' => $validated['status']];

        // Catat tanggal_daftar pertama kali peserta melakukan submit.
        if ($validated['status'] === 'submitted' && $pendaftaran->tanggal_daftar === null) {
            $data['tanggal_daftar'] = now();
        }

        if (array_key_exists('catatan_admin', $validated)) {
            $data['catatan_admin'] = $validated['catatan_admin'];
        }

        $pendaftaran->update($data);
        $pendaftaran->load('peserta');

        if ($validated['status'] === 'submitted' && $pendaftaran->peserta) {
            $pendaftaran->peserta->update(['status_seleksi' => 'submitted']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Status pendaftaran berhasil diperbarui.',
            'data'    => $pendaftaran,
        ]);
    }
}
