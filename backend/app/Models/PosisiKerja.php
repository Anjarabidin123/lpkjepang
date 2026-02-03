<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PosisiKerja extends Model
{
    protected $guarded = [];

    public function perusahaan()
    {
        return $this->belongsTo(Perusahaan::class);
    }

    public function jenisKerja()
    {
        return $this->belongsTo(JenisKerja::class);
    }
}
