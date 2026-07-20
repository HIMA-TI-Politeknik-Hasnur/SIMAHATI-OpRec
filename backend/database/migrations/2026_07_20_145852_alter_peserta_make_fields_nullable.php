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
        Schema::table('peserta', function (Blueprint $table) {
            $table->string('nim', 20)->nullable()->change();
            $table->tinyInteger('semester')->nullable()->change();
            $table->string('program_studi', 100)->nullable()->change();
            $table->smallInteger('angkatan')->nullable()->change();
            $table->string('nomor_hp', 20)->nullable()->change();
            $table->text('alamat')->nullable()->change();
            $table->unsignedBigInteger('pilihan_divisi_1')->nullable()->change();
            $table->text('motivasi')->nullable()->change();
            $table->text('kontribusi')->nullable()->change();
            $table->text('harapan')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('peserta', function (Blueprint $table) {
            $table->string('nim', 20)->nullable(false)->change();
            $table->tinyInteger('semester')->nullable(false)->change();
            $table->string('program_studi', 100)->nullable(false)->change();
            $table->smallInteger('angkatan')->nullable(false)->change();
            $table->string('nomor_hp', 20)->nullable(false)->change();
            $table->text('alamat')->nullable(false)->change();
            $table->unsignedBigInteger('pilihan_divisi_1')->nullable(false)->change();
            $table->text('motivasi')->nullable(false)->change();
            $table->text('kontribusi')->nullable(false)->change();
            $table->text('harapan')->nullable(false)->change();
        });
    }
};
