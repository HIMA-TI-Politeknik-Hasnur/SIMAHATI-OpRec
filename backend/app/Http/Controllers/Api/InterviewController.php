<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Interview;
use App\Models\Penilaian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InterviewController extends Controller
{
    public function index()
    {
        $interviews = Interview::with(['interviewer:id,name', 'penilaian'])
            ->orderBy('tanggal')
            ->orderBy('waktu')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $interviews
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'peserta_id'     => 'required|integer|exists:peserta,id',
            'interviewer_id' => 'required|integer|exists:users,id',
            'tanggal'        => 'required|date',
            'waktu'          => 'required|date_format:H:i',
            'lokasi'         => 'required|string|max:255',
            'status'         => 'in:scheduled,completed,cancelled',
            'catatan'        => 'nullable|string',
        ]);

        $interview = Interview::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Jadwal interview berhasil dibuat.',
            'data'    => $interview
        ], 201);
    }

    public function show(Interview $interview)
    {
        $interview->load(['interviewer:id,name', 'penilaian']);

        return response()->json([
            'success' => true,
            'data'    => $interview
        ]);
    }

    public function update(Request $request, Interview $interview)
    {
        $validated = $request->validate([
            'peserta_id'     => 'sometimes|required|integer|exists:peserta,id',
            'interviewer_id' => 'sometimes|required|integer|exists:users,id',
            'tanggal'        => 'sometimes|required|date',
            'waktu'          => 'sometimes|required|date_format:H:i',
            'lokasi'         => 'sometimes|required|string|max:255',
            'status'         => 'sometimes|in:scheduled,completed,cancelled',
            'catatan'        => 'nullable|string',
        ]);

        $interview->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Jadwal interview berhasil diupdate.',
            'data'    => $interview
        ]);
    }

    public function destroy(Interview $interview)
    {
        $interview->delete();

        return response()->json([
            'success' => true,
            'message' => 'Jadwal interview berhasil dihapus.'
        ]);
    }

    public function saya(Request $request)
    {
        $user = $request->user();
        $peserta = $user->peserta;

        if (!$peserta) {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum terdaftar sebagai peserta.',
            ], 404);
        }

        $interview = Interview::with(['interviewer:id,name', 'penilaian'])
            ->where('peserta_id', $peserta->id)
            ->first();

        if (!$interview) {
            return response()->json([
                'success' => true,
                'data'    => null,
                'message' => 'Belum ada jadwal interview.',
            ]);
        }

        return response()->json([
            'success' => true,
            'data'    => $interview,
        ]);
    }

    public function beriPenilaian(Request $request, Interview $interview)
    {
        $validated = $request->validate([
            'nilai'   => 'required|integer|min:0|max:100',
            'catatan' => 'nullable|string',
        ]);

        // Kalau sudah ada penilaian sebelumnya, update — kalau belum, buat baru
        $penilaian = Penilaian::updateOrCreate(
            ['interview_id' => $interview->id],
            [
                'interviewer_id' => Auth::id(),
                'nilai'          => $validated['nilai'],
                'catatan'        => $validated['catatan'] ?? null,
            ]
        );

        // Tandai interview sebagai completed
        $interview->update(['status' => 'completed']);

        return response()->json([
            'success' => true,
            'message' => 'Penilaian berhasil disimpan.',
            'data'    => $penilaian
        ], 201);
    }
}
