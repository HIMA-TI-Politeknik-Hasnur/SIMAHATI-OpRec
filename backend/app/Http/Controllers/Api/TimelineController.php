<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Timeline;
use Illuminate\Http\Request;

class TimelineController extends Controller
{
    public function publik()
    {
        $timelines = Timeline::where('is_active', true)->orderBy('tanggal_mulai', 'asc')->get();
        return response()->json([
            'success' => true,
            'data' => $timelines
        ]);
    }

    public function index()
    {
        $timelines = Timeline::orderBy('tanggal_mulai', 'asc')->get();
        return response()->json([
            'success' => true,
            'data' => $timelines
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'is_active' => 'boolean'
        ]);

        $timeline = Timeline::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Timeline berhasil dibuat.',
            'data' => $timeline
        ], 201);
    }

    public function show(Timeline $timeline)
    {
        return response()->json([
            'success' => true,
            'data' => $timeline
        ]);
    }

    public function update(Request $request, Timeline $timeline)
    {
        $validated = $request->validate([
            'judul' => 'sometimes|required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal_mulai' => 'sometimes|required|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'is_active' => 'boolean'
        ]);

        $timeline->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Timeline berhasil diupdate.',
            'data' => $timeline
        ]);
    }

    public function destroy(Timeline $timeline)
    {
        $timeline->delete();

        return response()->json([
            'success' => true,
            'message' => 'Timeline berhasil dihapus.'
        ]);
    }
}
