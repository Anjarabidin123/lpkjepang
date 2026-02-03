<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Perusahaan extends Model
{
    protected $guarded = [];

    public function kumiai()
    {
        return $this->belongsTo(Kumiai::class);
    }
}
