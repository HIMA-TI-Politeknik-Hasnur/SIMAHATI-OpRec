<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Divisi;
use Illuminate\Http\Request;

class DivisiController extends Controller
{
    public function index()
    {
        $divisis = Divisi::orderBy('nama')->get();

        return response()->json([
            'success' => true,
            'data' => $divisis
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama'      => 'required|string|max:255|unique:divisi,nama',
            'deskripsi' => 'required|string',
            'kuota'     => 'required|integer|min:1',
        ]);

        $divisi = Divisi::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Divisi berhasil dibuat.',
            'data'    => $divisi
        ], 201);
    }

    public function show(Divisi $divisi)
    {
        return response()->json([
            'success' => true,
            'data'    => $divisi
        ]);
    }

    public function update(Request $request, Divisi $divisi)
    {
        $validated = $request->validate([
            'nama'      => 'sometimes|required|string|max:255|unique:divisi,nama,' . $divisi->id,
            'deskripsi' => 'sometimes|required|string',
            'kuota'     => 'sometimes|required|integer|min:1',
        ]);

        $divisi->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Divisi berhasil diupdate.',
            'data'    => $divisi
        ]);
    }

    public function destroy(Divisi $divisi)
    {
        $divisi->delete();

        return response()->json([
            'success' => true,
            'message' => 'Divisi berhasil dihapus.'
        ]);
    }
}
