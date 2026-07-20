<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Reyhan: Auth
use App\Http\Controllers\Api\AuthController;

// Nadil: Pendaftaran
use App\Http\Controllers\Api\PesertaController;
use App\Http\Controllers\Api\PendaftaranController;
use App\Http\Controllers\Api\UploadController;

// Rizky: CMS & Landing Page
use App\Http\Controllers\Api\PengumumanController;
use App\Http\Controllers\Api\TimelineController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\DivisiController;
use App\Http\Controllers\Api\InterviewController;

// ─── Auth (Reyhan) ───────────────────────────────────────────────────────────

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('user', [AuthController::class, 'user']);
});

// ─── Pendaftaran (Nadil) ──────────────────────────────────────────────────────

Route::apiResource('peserta', PesertaController::class)
    ->parameters([
        'peserta' => 'peserta',
    ]);

// PATCH /peserta/{peserta}/verifikasi — ubah status_verifikasi & status_seleksi
Route::patch('peserta/{peserta}/verifikasi', [PesertaController::class, 'verifikasi'])
    ->name('peserta.verifikasi');

Route::apiResource('pendaftaran', PendaftaranController::class)
    ->parameters([
        'pendaftaran' => 'pendaftaran',
    ]);

// PATCH /pendaftaran/{pendaftaran}/status — ubah status & catatan_admin
Route::patch('pendaftaran/{pendaftaran}/status', [PendaftaranController::class, 'updateStatus'])
    ->name('pendaftaran.updateStatus');

Route::apiResource('upload', UploadController::class)
    ->parameters([
        'upload' => 'upload',
    ]);

// ─── CMS & Landing Page (Rizky) ───────────────────────────────────────────────

Route::apiResource('pengumuman', PengumumanController::class);
Route::apiResource('timeline', TimelineController::class);
Route::apiResource('faq', FaqController::class);
Route::apiResource('settings', SettingController::class);

Route::get('notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
Route::post('notifications/{id}/read', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);

Route::get('report/excel', [\App\Http\Controllers\Api\ReportController::class, 'exportExcel']);
Route::get('report/pdf', [\App\Http\Controllers\Api\ReportController::class, 'exportPdf']);

// As per Anton's assignment:

Route::apiResource('divisi', DivisiController::class);
Route::apiResource('interview', InterviewController::class);
Route::post('interview/{interview}/penilaian', [InterviewController::class, 'beriPenilaian']);
