<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUploadRequest;
use App\Http\Requests\UpdateUploadRequest;
use App\Models\Upload;

class UploadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $upload = Upload::with([
            'peserta',
        ])->get();

        return response()->json([
            'success' => true,
            'message' => 'Data upload berhasil diambil.',
            'data' => $upload,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUploadRequest $request)
    {
        $upload = Upload::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Data upload berhasil ditambahkan.',
            'data' => $upload,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Upload $upload)
    {
        $upload->load([
            'peserta',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Detail upload berhasil diambil.',
            'data' => $upload,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUploadRequest $request, Upload $upload)
    {
        $upload->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Data upload berhasil diperbarui.',
            'data' => $upload,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Upload $upload)
    {
        $upload->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data upload berhasil dihapus.',
        ]);
    }
}