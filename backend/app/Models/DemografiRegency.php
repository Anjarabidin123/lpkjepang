<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DemografiRegency extends Model
{
    protected $guarded = [];

    public function province()
    {
        return $this->belongsTo(DemografiProvince::class, 'province_id');
    }
}
