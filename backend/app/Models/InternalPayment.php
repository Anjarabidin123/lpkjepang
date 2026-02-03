<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InternalPayment extends Model
{
    protected $table = 'internal_payments';
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
