<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        "entreprise_name", "work", "date", "task", "cv_id"
    ];

    protected $table = "experience";

    public function cv() {
        $this->belongsTo(CV::class);
    }
}
