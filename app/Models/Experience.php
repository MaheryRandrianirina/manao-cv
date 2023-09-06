<?php

namespace App\Models;

use App\Traits\DateGetter;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasFactory;

    use DateGetter;

    private $format = "Y-m-d";

    private $dateMustBeLitterals = true;

    public $timestamps = false;

    protected $fillable = [
        "entreprise_name", "work", "date_debut", "date_end", "task", "cv_id"
    ];

    protected $table = "experience";

    public function cv() {
        return $this->belongsTo(Cv::class);
    }
}
