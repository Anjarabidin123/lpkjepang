<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobOrderPeserta extends Model
{
    protected $guarded = [];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function jobOrder()
    {
        return $this->belongsTo(JobOrder::class);
    }
}
