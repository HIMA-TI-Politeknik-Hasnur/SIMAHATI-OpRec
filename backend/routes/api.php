<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PesertaController;

Route::apiResource('peserta', PesertaController::class)
    ->parameters([
        'peserta' => 'peserta',
    ]);