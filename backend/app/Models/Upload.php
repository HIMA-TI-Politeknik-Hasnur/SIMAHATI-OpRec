<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Upload extends Model
{
    protected $table = 'uploads';

    protected $fillable = [
        'peserta_id',
        'jenis_dokumen',
        'original_name',
        'file_path',
        'mime_type',
        'ukuran_file',
    ];

    public function peserta(): BelongsTo
    {
        return $this->belongsTo(Peserta::class);
    }
}