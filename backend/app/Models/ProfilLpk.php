<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfilLpk extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'pemilik',
        'alamat',
        'no_telp',
        'email',
        'website',
        'logo_url',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
