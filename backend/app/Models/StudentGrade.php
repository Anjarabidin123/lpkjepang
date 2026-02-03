<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentGrade extends Model
{
    use HasFactory;

    protected $fillable = ['siswa_id', 'subject', 'score', 'exam_date', 'result', 'teacher_comments'];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }
}
