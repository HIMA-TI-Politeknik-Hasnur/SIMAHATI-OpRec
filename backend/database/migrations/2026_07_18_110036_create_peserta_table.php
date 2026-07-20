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
        Schema::create('peserta', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('nama_lengkap', 100);
            $table->string('nim', 20)->unique();
            $table->tinyInteger('semester');
            $table->string('program_studi', 100)->index();
            $table->smallInteger('angkatan')->index();

            $table->string('email', 100);
            $table->string('nomor_hp', 20);

            $table->text('alamat');

            $table->text('pengalaman_organisasi')->nullable();
            $table->text('skill')->nullable();
            $table->text('prestasi')->nullable();

            // Foreign key akan ditambahkan setelah migration tabel divisi tersedia.
            $table->unsignedBigInteger('pilihan_divisi_1');
            $table->unsignedBigInteger('pilihan_divisi_2')->nullable();

            $table->text('motivasi');
            $table->text('kontribusi');
            $table->text('harapan');

            $table->enum('status_verifikasi', [
                'pending',
                'verified',
                'rejected'
            ])->default('pending')->index();

            $table->enum('status_seleksi', [
                'draft',
                'submitted',
                'interview',
                'accepted',
                'rejected'
            ])->default('draft')->index();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peserta');
    }
};
