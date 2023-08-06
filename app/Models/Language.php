<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        "name", "level", "string_level", "cv_id"
    ];

    protected $table = "language";

    public function cv() {
        return $this->belongsTo(Cv::class);
    }
}
