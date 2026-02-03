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

    public function posisiKerja()
    {
        return $this->belongsTo(PosisiKerja::class);
    }

    public function lpkMitra()
    {
        return $this->belongsTo(LpkMitra::class);
    }

    public function keluargaIndonesia()
    {
        return $this->hasMany(SiswaKeluargaIndonesia::class);
    }

    public function keluargaJepang()
    {
        return $this->hasMany(SiswaKeluargaJepang::class);
    }

    public function kontakKeluarga()
    {
        return $this->hasMany(SiswaKontakKeluarga::class);
    }

    public function pengalamanKerja()
    {
        return $this->hasMany(SiswaPengalamanKerja::class);
    }
}
