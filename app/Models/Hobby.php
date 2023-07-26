<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hobby extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        "name", "cv_id"
    ];

    protected $table = "hobby";
    
    public function cv() {
        return $this->belongsTo(Cv::class);
    }
}
