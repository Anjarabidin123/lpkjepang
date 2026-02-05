<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Siswa extends Model
{
    protected $guarded = [];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function province()
    {
        return $this->belongsTo(DemografiProvince::class, 'demografi_province_id');
    }

    public function regency()
    {
        return $this->belongsTo(DemografiRegency::class, 'demografi_regency_id');
    }

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function posisi_kerja()
    {
        return $this->belongsTo(PosisiKerja::class);
    }

    public function lpk_mitra()
    {
        return $this->belongsTo(LpkMitra::class);
    }

    public function keluarga_indonesia()
    {
        return $this->hasMany(SiswaKeluargaIndonesia::class);
    }

    public function keluarga_jepang()
    {
        return $this->hasMany(SiswaKeluargaJepang::class);
    }

    public function kontak_keluarga()
    {
        return $this->hasMany(SiswaKontakKeluarga::class);
    }

    public function pengalaman_kerja()
    {
        return $this->hasMany(SiswaPengalamanKerja::class);
    }

    public function pendidikan()
    {
        return $this->hasMany(SiswaPendidikan::class);
    }

    public function siswa_magang()
    {
        return $this->hasMany(SiswaMagang::class);
    }
}

