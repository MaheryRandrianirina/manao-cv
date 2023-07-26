<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formation extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        "etablissement", "date", "graduation","cv_id"
    ];

    protected $table = "formation";

    public function cv() {
        return $this->belongsTo(Cv::class);
    }
}
