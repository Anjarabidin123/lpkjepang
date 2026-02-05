<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobOrder extends Model
{
    protected $guarded = [];

    public function kumiai()
    {
        return $this->belongsTo(Kumiai::class);
    }

    public function jenis_kerja()
    {
        return $this->belongsTo(JenisKerja::class);
    }

    public function perusahaan()
    {
        return $this->belongsTo(Perusahaan::class);
    }

    public function peserta()
    {
        return $this->hasMany(JobOrderPeserta::class);
    }
}

