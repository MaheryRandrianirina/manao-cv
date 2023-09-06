<?php

namespace App\Models;

use App\Traits\DateGetter;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formation extends Model
{
    use HasFactory;

    use DateGetter;

    private $format = "Y";

    public $timestamps = false;

    protected $fillable = [
        "etablissement", "date_debut", "date_end", "degree","cv_id"
    ];

    protected $table = "formation";

    public function cv() {
        return $this->belongsTo(Cv::class);
    }
}
