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
    public function jenis_kerja() { return $this->belongsTo(JenisKerja::class); }
    public function posisi_kerja() { return $this->belongsTo(PosisiKerja::class); }
    public function lpk_mitra() { return $this->belongsTo(LpkMitra::class); }
    public function demografi_province() { return $this->belongsTo(DemografiProvince::class); }
    public function demografi_regency() { return $this->belongsTo(DemografiRegency::class); }
}
