<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PesertaController;
use App\Http\Controllers\Api\PendaftaranController;
use App\Http\Controllers\Api\UploadController;

Route::apiResource('peserta', PesertaController::class)
    ->parameters([
        'peserta' => 'peserta',
    ]);

Route::apiResource('pendaftaran', PendaftaranController::class)
    ->parameters([
        'pendaftaran' => 'pendaftaran',
    ]);

Route::apiResource('upload', UploadController::class)
    ->parameters([
        'upload' => 'upload',
    ]);