<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Peserta extends Model
{
    protected $table = 'peserta';

    protected $fillable = [
        'user_id',
        'nama_lengkap',
        'nim',
        'semester',
        'program_studi',
        'angkatan',
        'email',
        'nomor_hp',
        'alamat',
        'pengalaman_organisasi',
        'skill',
        'prestasi',
        'pilihan_divisi_1',
        'pilihan_divisi_2',
        'motivasi',
        'kontribusi',
        'harapan',
        'status_verifikasi',
        'status_seleksi',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function pendaftaran(): HasOne
    {
        return $this->hasOne(Pendaftaran::class);
    }

    public function uploads(): HasMany
    {
        return $this->hasMany(Upload::class);
    }

    public function interviews(): HasMany
    {
        return $this->hasMany(Interview::class);
    }
}