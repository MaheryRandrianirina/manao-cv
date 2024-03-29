<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $table = "contact";

    public $timestamps = false;

    protected $fillable = [
        "phone_number", "adress", "email", "linkedin_url", "cv_id"
    ];

    public function cv() {
        return $this->belongsTo(Cv::class);
        
    }
}
