<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePesertaRequest;
use App\Http\Requests\UpdatePesertaRequest;
use App\Models\Peserta;
use Illuminate\Http\Request;

class PesertaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $peserta = Peserta::with([
            'user',
            'pendaftaran',
            'uploads',
        ])->get();

        return response()->json([
            'success' => true,
            'message' => 'Data peserta berhasil diambil.',
            'data' => $peserta,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePesertaRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();
        $peserta = Peserta::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Data peserta berhasil ditambahkan.',
            'data' => $peserta,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Peserta $peserta)
    {
        $peserta->load([
            'user',
            'pendaftaran',
            'uploads',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Detail peserta berhasil diambil.',
            'data' => $peserta,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePesertaRequest $request, Peserta $peserta)
    {
        $peserta->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Data peserta berhasil diperbarui.',
            'data' => $peserta,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Peserta $peserta)
    {
        $peserta->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data peserta berhasil dihapus.',
        ]);
    }

    /**
     * Memperbarui status verifikasi administrasi peserta.
     *
     * PATCH /peserta/{peserta}/verifikasi
     *
     * Body JSON:
     *   - status_verifikasi : pending|verified|rejected  (wajib)
     *   - catatan           : string                     (opsional)
     */
    public function verifikasi(Request $request, Peserta $peserta)
    {
        $validated = $request->validate([
            'status_verifikasi' => 'required|in:pending,verified,rejected',
            'catatan'           => 'nullable|string',
        ], [
            'status_verifikasi.required' => 'Status verifikasi wajib diisi.',
            'status_verifikasi.in'       => 'Status verifikasi tidak valid. Pilihan: pending, verified, rejected.',
            'catatan.string'             => 'Catatan harus berupa teks.',
        ]);

        $peserta->update([
            'status_verifikasi' => $validated['status_verifikasi'],
        ]);

        // Sinkronkan status_seleksi ketika admin memverifikasi atau menolak dokumen.
        if ($validated['status_verifikasi'] === 'verified') {
            // Jika masih draft/pending, naikkan ke submitted agar bisa diproses lebih lanjut.
            if ($peserta->status_seleksi === 'draft') {
                $peserta->update(['status_seleksi' => 'submitted']);
            }
        } elseif ($validated['status_verifikasi'] === 'rejected') {
            $peserta->update(['status_seleksi' => 'rejected']);
        }

        // Jika ada catatan, simpan ke record pendaftaran milik peserta ini.
        if (! empty($validated['catatan']) && $peserta->pendaftaran) {
            $peserta->pendaftaran->update(['catatan_admin' => $validated['catatan']]);
        }

        $peserta->load(['user', 'pendaftaran', 'uploads']);

        return response()->json([
            'success' => true,
            'message' => 'Status verifikasi peserta berhasil diperbarui.',
            'data'    => $peserta,
        ]);
    }
}
