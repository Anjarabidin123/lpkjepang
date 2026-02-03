<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DemografiProvince extends Model
{
    protected $guarded = [];

    public function regencies()
    {
        return $this->hasMany(DemografiRegency::class, 'province_id');
    }
}
