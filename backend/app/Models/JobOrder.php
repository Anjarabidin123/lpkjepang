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

    public function jenisKerja()
    {
        return $this->belongsTo(JenisKerja::class);
    }
}
