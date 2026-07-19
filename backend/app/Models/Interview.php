<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Interview extends Model
{
    protected $fillable = [
        'peserta_id',
        'interviewer_id',
        'tanggal',
        'waktu',
        'lokasi',
        'status',
        'catatan',
    ];

    public function peserta()
    {
        return $this->belongsTo(Peserta::class);
    }

    public function interviewer()
    {
        return $this->belongsTo(User::class, 'interviewer_id');
    }

    public function penilaian()
    {
        return $this->hasOne(Penilaian::class);
    }
}
