<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\PengumumanController;
use App\Http\Controllers\Api\TimelineController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\DivisiController;

// As per Rizky's assignment:

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

