<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        "name", "level", "cv_id"
    ];

    protected $table = "skill";
    
    public function cv() {
        $this->belongsTo(CV::class);
    }
}
