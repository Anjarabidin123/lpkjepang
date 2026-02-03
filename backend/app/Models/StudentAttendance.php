<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentAttendance extends Model
{
    use HasFactory;

    protected $fillable = ['siswa_id', 'date', 'status', 'notes'];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }
}
