<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentVariable extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'display_name',
        'kategori',
        'source_table',
        'source_field',
        'format_type',
        'default_value',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
