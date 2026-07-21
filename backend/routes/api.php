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

Route::get('health', fn () => response()->json(['status' => 'ok', 'time' => now()]));

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('email/resend-verification', [AuthController::class, 'resendVerification']);

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

// Route yang bisa diakses peserta (data milik sendiri)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('peserta', [PesertaController::class, 'store']);
    Route::put('peserta/{peserta}', [PesertaController::class, 'update']);
    Route::get('peserta/{peserta}', [PesertaController::class, 'show']);

    Route::post('pendaftaran', [PendaftaranController::class, 'store']);
    Route::post('upload', [UploadController::class, 'store']);
});

// Route khusus panitia/admin (manajemen peserta)
Route::middleware(['auth:sanctum', 'role:Super Admin,Admin,Panitia'])->group(function () {
    Route::get('peserta', [PesertaController::class, 'index']);
    Route::delete('peserta/{peserta}', [PesertaController::class, 'destroy']);

    Route::patch('peserta/{peserta}/verifikasi', [PesertaController::class, 'verifikasi'])
        ->name('peserta.verifikasi');

    Route::patch('peserta/{peserta}/seleksi', [PesertaController::class, 'seleksi'])
        ->name('peserta.seleksi');

    Route::get('pendaftaran', [PendaftaranController::class, 'index']);
    Route::get('pendaftaran/{pendaftaran}', [PendaftaranController::class, 'show']);
    Route::put('pendaftaran/{pendaftaran}', [PendaftaranController::class, 'update']);
    Route::delete('pendaftaran/{pendaftaran}', [PendaftaranController::class, 'destroy']);

    Route::patch('pendaftaran/{pendaftaran}/status', [PendaftaranController::class, 'updateStatus'])
        ->name('pendaftaran.updateStatus');

    Route::get('upload', [UploadController::class, 'index']);
    Route::get('upload/{upload}', [UploadController::class, 'show']);
    Route::put('upload/{upload}', [UploadController::class, 'update']);
    Route::delete('upload/{upload}', [UploadController::class, 'destroy']);
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

// Route publik — bisa diakses siapa saja (termasuk peserta yang belum login)
Route::get('pengumuman/publik', [PengumumanController::class, 'publik']);
Route::get('timeline/publik', [TimelineController::class, 'publik']);
Route::get('faq/publik', [FaqController::class, 'publik']);
Route::get('divisi/publik', [DivisiController::class, 'publik']);

// Route interview khusus peserta (lihat jadwal sendiri)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('interview/saya', [InterviewController::class, 'saya']);
});

Route::middleware(['auth:sanctum', 'role:Super Admin,Admin,Panitia,Interviewer'])->group(function () {
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

    // Untuk dropdown pilih interviewer
    Route::get('users/interviewers', function () {
        $users = \App\Models\User::whereHas('roles', fn ($q) => $q->where('slug', 'interviewer'))
            ->select('id', 'name', 'email')->get();
        return response()->json(['success' => true, 'data' => $users]);
    });
});
