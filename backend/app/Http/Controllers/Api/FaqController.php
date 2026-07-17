<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = Faq::where('is_active', true)->get();
        return response()->json([
            'success' => true,
            'data' => $faqs
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pertanyaan' => 'required|string|max:255',
            'jawaban' => 'required|string',
            'is_active' => 'boolean'
        ]);

        $faq = Faq::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'FAQ berhasil dibuat.',
            'data' => $faq
        ], 201);
    }

    public function show(Faq $faq)
    {
        return response()->json([
            'success' => true,
            'data' => $faq
        ]);
    }

    public function update(Request $request, Faq $faq)
    {
        $validated = $request->validate([
            'pertanyaan' => 'sometimes|required|string|max:255',
            'jawaban' => 'sometimes|required|string',
            'is_active' => 'boolean'
        ]);

        $faq->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'FAQ berhasil diupdate.',
            'data' => $faq
        ]);
    }

    public function destroy(Faq $faq)
    {
        $faq->delete();

        return response()->json([
            'success' => true,
            'message' => 'FAQ berhasil dihapus.'
        ]);
    }
}
