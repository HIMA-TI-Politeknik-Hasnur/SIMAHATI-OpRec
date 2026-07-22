<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Benefit;
use Illuminate\Http\Request;

class BenefitController extends Controller
{
    public function publik()
    {
        $benefits = Benefit::where('is_active', true)->orderBy('sort_order')->get();
        return response()->json([
            'success' => true,
            'data' => $benefits
        ]);
    }

    public function index()
    {
        $benefits = Benefit::orderBy('sort_order')->get();
        return response()->json([
            'success' => true,
            'data' => $benefits
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'icon' => 'required|string|max:50',
            'title' => 'required|string|max:255',
            'desc' => 'required|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $benefit = Benefit::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Benefit berhasil dibuat.',
            'data' => $benefit
        ], 201);
    }

    public function show(Benefit $benefit)
    {
        return response()->json([
            'success' => true,
            'data' => $benefit
        ]);
    }

    public function update(Request $request, Benefit $benefit)
    {
        $validated = $request->validate([
            'icon' => 'sometimes|required|string|max:50',
            'title' => 'sometimes|required|string|max:255',
            'desc' => 'sometimes|required|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $benefit->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Benefit berhasil diupdate.',
            'data' => $benefit
        ]);
    }

    public function destroy(Benefit $benefit)
    {
        $benefit->delete();

        return response()->json([
            'success' => true,
            'message' => 'Benefit berhasil dihapus.'
        ]);
    }
}
