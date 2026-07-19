<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePendaftaranRequest;
use App\Http\Requests\UpdatePendaftaranRequest;
use App\Models\Pendaftaran;

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
        $pendaftaran = Pendaftaran::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Data pendaftaran berhasil ditambahkan.',
            'data' => $pendaftaran,
        ], 201);
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
}
