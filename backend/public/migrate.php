<?php
// ⚠️ TEMPORARY — HAPUS FILE INI SETELAH MIGRASI SELESAI
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->call('migrate', ['--force' => true]);
$kernel->call('db:seed', ['--force' => true]);
echo json_encode(['status' => 'ok', 'message' => 'Migration & seeding completed!']);
