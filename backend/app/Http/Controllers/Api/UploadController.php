<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUploadRequest;
use App\Http\Requests\UpdateUploadRequest;
use App\Models\Upload;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    /**
     * Folder penyimpanan dokumen peserta di disk 'public'.
     */
    private const STORAGE_DIR = 'dokumen-peserta';

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $uploads = Upload::with('peserta')->get();

        return response()->json([
            'success' => true,
            'message' => 'Data upload berhasil diambil.',
            'data'    => $uploads,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * Menerima multipart/form-data dengan field:
     *   - peserta_id   : integer
     *   - jenis_dokumen: foto|ktm|cv|sertifikat
     *   - file         : file yang diunggah
     */
    public function store(StoreUploadRequest $request)
    {
        $file = $request->file('file');

        // Simpan file ke storage/app/public/dokumen-peserta/{jenis_dokumen}/
        $directory = self::STORAGE_DIR . '/' . $request->input('jenis_dokumen');
        $path      = $file->store($directory, 'public');

        $upload = Upload::create([
            'peserta_id'    => $request->input('peserta_id'),
            'jenis_dokumen' => $request->input('jenis_dokumen'),
            'original_name' => $file->getClientOriginalName(),
            'file_path'     => $path,
            'mime_type'     => $file->getMimeType(),
            'ukuran_file'   => $file->getSize(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'File berhasil diunggah.',
            'data'    => $upload,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Upload $upload)
    {
        $upload->load('peserta');

        // Sertakan URL publik agar frontend bisa langsung menampilkan file.
        $data             = $upload->toArray();
        $data['file_url'] = Storage::disk('public')->url($upload->file_path);

        return response()->json([
            'success' => true,
            'message' => 'Detail upload berhasil diambil.',
            'data'    => $data,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * Jika field 'file' dikirim, file lama dihapus dan diganti file baru.
     * Field 'jenis_dokumen' dan 'peserta_id' bersifat opsional.
     */
    public function update(UpdateUploadRequest $request, Upload $upload)
    {
        $data = [];

        if ($request->hasFile('file')) {
            // Hapus file lama dari storage.
            if (Storage::disk('public')->exists($upload->file_path)) {
                Storage::disk('public')->delete($upload->file_path);
            }

            $file = $request->file('file');

            // Gunakan jenis_dokumen baru kalau dikirim, atau pakai yang lama.
            $jenis     = $request->input('jenis_dokumen', $upload->jenis_dokumen);
            $directory = self::STORAGE_DIR . '/' . $jenis;
            $path      = $file->store($directory, 'public');

            $data = [
                'original_name' => $file->getClientOriginalName(),
                'file_path'     => $path,
                'mime_type'     => $file->getMimeType(),
                'ukuran_file'   => $file->getSize(),
            ];
        }

        // Update jenis_dokumen / peserta_id kalau dikirim.
        if ($request->filled('jenis_dokumen')) {
            $data['jenis_dokumen'] = $request->input('jenis_dokumen');
        }

        if ($request->filled('peserta_id')) {
            $data['peserta_id'] = $request->input('peserta_id');
        }

        $upload->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Data upload berhasil diperbarui.',
            'data'    => $upload->fresh(),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * Menghapus record dari database sekaligus file fisik dari storage.
     */
    public function destroy(Upload $upload)
    {
        // Hapus file fisik terlebih dahulu.
        if (Storage::disk('public')->exists($upload->file_path)) {
            Storage::disk('public')->delete($upload->file_path);
        }

        $upload->delete();

        return response()->json([
            'success' => true,
            'message' => 'File berhasil dihapus.',
        ]);
    }
}
