<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kumiai extends Model
{
    protected $guarded = [];

    public function perusahaan()
    {
        return $this->hasMany(Perusahaan::class);
    }
}
