<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiswaDocument extends Model
{
    protected $guarded = [];

    public function siswaMagang()
    {
        return $this->belongsTo(SiswaMagang::class);
    }

    public function template()
    {
        return $this->belongsTo(DocumentTemplate::class, 'document_template_id');
    }
}
