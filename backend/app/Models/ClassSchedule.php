<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassSchedule extends Model
{
    protected $fillable = [
        'subject',
        'day_of_week',
        'start_time',
        'end_time',
        'room',
        'teacher_name',
        'notes',
        'is_active'
    ];
}
