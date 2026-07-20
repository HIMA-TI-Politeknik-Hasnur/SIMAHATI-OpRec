<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

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

    protected $appends = ['file_url'];

    public function getFileUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->file_path);
    }

    public function peserta(): BelongsTo
    {
        return $this->belongsTo(Peserta::class);
    }
}