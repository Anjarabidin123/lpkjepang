<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KewajibanPembayaran extends Model
{
    protected $table = 'kewajiban_pembayaran';
    protected $guarded = [];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function itemPembayaran()
    {
        return $this->belongsTo(ItemPembayaran::class, 'item_pembayaran_id');
    }
}
