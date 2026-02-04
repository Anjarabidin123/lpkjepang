<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentTemplate extends Model
{
    use HasFactory;

    protected $table = 'document_templates';

    protected $fillable = [
        'kode',
        'nama',
        'kategori',
        'deskripsi', 
        'template_content',
        'is_active',
        'urutan',
        'is_required'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_required' => 'boolean',
        'urutan' => 'integer',
    ];
}
