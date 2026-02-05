<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $guarded = [];

    public function kumiai()
    {
        return $this->belongsTo(Kumiai::class);
    }

    public function invoice_items()
    {
        return $this->hasMany(InvoiceItem::class);
    }
}
