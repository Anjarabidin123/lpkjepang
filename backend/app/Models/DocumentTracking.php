<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentTracking extends Model
{
    use HasFactory;

    protected $fillable = [
        'siswa_id',
        'passport_status',
        'passport_expiry',
        'mcu_status',
        'mcu_date',
        'language_cert_status',
        'language_cert_level',
        'coe_status',
        'coe_number',
        'coe_issue_date',
        'visa_status',
        'visa_expiry',
        'flight_status',
        'departure_datetime',
        'notes'
    ];

    protected $casts = [
        'passport_expiry' => 'date',
        'mcu_date' => 'date',
        'coe_issue_date' => 'date',
        'visa_expiry' => 'date',
        'departure_datetime' => 'datetime',
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }
}
