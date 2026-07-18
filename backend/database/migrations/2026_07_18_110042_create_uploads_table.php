<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('uploads', function (Blueprint $table) {
            $table->id();

            $table->foreignId('peserta_id')
                ->constrained('peserta')
                ->cascadeOnDelete();

            $table->enum('jenis_dokumen', [
                'foto',
                'ktm',
                'cv',
                'sertifikat'
            ]);

            $table->string('original_name', 255);

            $table->string('file_path', 255);

            $table->string('mime_type', 100);

            $table->unsignedBigInteger('ukuran_file');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uploads');
    }
};
