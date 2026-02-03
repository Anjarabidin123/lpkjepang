<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiswaPendidikan extends Model
{
    protected $table = 'siswa_pendidikan';
    protected $guarded = [];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }
}
