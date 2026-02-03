<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecruitmentApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_number',
        'siswa_id',
        'program_id',
        'status',
        'application_date',
        'interview_date',
        'interview_notes',
        'score',
        'rejection_reason',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'application_date' => 'date',
        'interview_date' => 'date',
        'reviewed_at' => 'datetime',
    ];

    /**
     * Get the siswa for this application
     */
    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    /**
     * Get the program for this application
     */
    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    /**
     * Get the reviewer
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Generate application number
     */
    public static function generateApplicationNumber()
    {
        $year = date('Y');
        $month = date('m');
        $lastApplication = self::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastApplication ? (int)substr($lastApplication->application_number, -4) + 1 : 1;
        
        return sprintf('APP-%s%s-%04d', $year, $month, $sequence);
    }
}
