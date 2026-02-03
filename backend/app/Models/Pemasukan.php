<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pemasukan extends Model
{
    protected $table = 'pemasukan';
    protected $guarded = [];

    public function kategori()
    {
        return $this->belongsTo(KategoriPemasukan::class, 'kategori_id');
    }
}
