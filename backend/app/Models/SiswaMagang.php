<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiswaMagang extends Model
{
    protected $guarded = [];

    public function siswa() { return $this->belongsTo(Siswa::class); }
    public function kumiai() { return $this->belongsTo(Kumiai::class); }
    public function perusahaan() { return $this->belongsTo(Perusahaan::class); }
    public function program() { return $this->belongsTo(Program::class); }
    public function jenisKerja() { return $this->belongsTo(JenisKerja::class); }
    public function posisiKerja() { return $this->belongsTo(PosisiKerja::class); }
    public function lpkMitra() { return $this->belongsTo(LpkMitra::class); }
    public function demografiProvince() { return $this->belongsTo(DemografiProvince::class); }
    public function demografiRegency() { return $this->belongsTo(DemografiRegency::class); }
}
