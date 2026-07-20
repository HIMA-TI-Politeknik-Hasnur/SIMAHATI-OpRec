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
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\PermissionController;

// ─── Auth (Reyhan) ───────────────────────────────────────────────────────────

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::post('forgot-password', [\App\Http\Controllers\Api\ForgotPasswordController::class, 'sendResetLink']);
Route::post('reset-password', [\App\Http\Controllers\Api\ForgotPasswordController::class, 'reset']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('user', [AuthController::class, 'user']);
    Route::post('refresh-token', [AuthController::class, 'refreshToken']);
});

Route::post('session/login', [AuthController::class, 'sessionLogin']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('session/logout', [AuthController::class, 'sessionLogout']);
    Route::get('session/user', [AuthController::class, 'sessionUser']);
});

// ─── Pendaftaran (Nadil) ──────────────────────────────────────────────────────

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('peserta', PesertaController::class)
        ->parameters([
            'peserta' => 'peserta',
        ]);

    // PATCH /peserta/{peserta}/verifikasi — ubah status_verifikasi & status_seleksi
    Route::patch('peserta/{peserta}/verifikasi', [PesertaController::class, 'verifikasi'])
        ->name('peserta.verifikasi');

    // PATCH /peserta/{peserta}/seleksi — ubah status_seleksi (interview/accepted/rejected)
    Route::patch('peserta/{peserta}/seleksi', [PesertaController::class, 'seleksi'])
        ->name('peserta.seleksi');

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
});

// ─── Dashboard Stats (Reyhan) ──────────────────────────────────────────────────

Route::middleware(['auth:sanctum', 'role:Super Admin,Admin,Panitia'])->prefix('dashboard')->group(function () {
    Route::get('/stats', [\App\Http\Controllers\Api\DashboardController::class, 'stats']);
});

// ─── Roles & Permissions (Reyhan) ─────────────────────────────────────────────

Route::middleware(['auth:sanctum', 'role:Super Admin,Admin'])->group(function () {
    Route::get('roles', [RoleController::class, 'index']);
    Route::get('permissions', [PermissionController::class, 'index']);
    Route::get('roles/{role}', [RoleController::class, 'show']);
});

Route::middleware(['auth:sanctum', 'role:Super Admin'])->group(function () {
    Route::post('roles', [RoleController::class, 'store']);
    Route::put('roles/{role}', [RoleController::class, 'update']);
    Route::delete('roles/{role}', [RoleController::class, 'destroy']);
    Route::post('roles/{role}/permissions', [RoleController::class, 'assignPermissions']);
    Route::post('users/{user}/roles', [RoleController::class, 'assignRoleToUser']);
});

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
