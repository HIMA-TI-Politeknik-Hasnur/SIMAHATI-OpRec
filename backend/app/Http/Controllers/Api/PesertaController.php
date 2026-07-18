<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePesertaRequest;
use App\Http\Requests\UpdatePesertaRequest;
use App\Models\Peserta;

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
        $peserta = Peserta::create($request->validated());

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
}
