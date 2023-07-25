<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CV extends Model
{
    use HasFactory;

    protected $fillable = [
        "name", "firstname", 
        "sex", "current_work", 
        "profile", "image", 
        "is_recorded", "created_at",
        "updated_at", "contact_id",
        "model"
    ];

    protected $table = "cvs";

    public function contact() {
        $this->hasOne(Contact::class);
    }

    public function experiences() {
        $this->hasMany(Experience::class);
    }

    public function formations() {
        $this->hasMany(Formation::class);
    }

    public function hobbies() {
        $this->hasMany(Hobby::class);
    }

    public function languages() {
        $this->hasMany(Language::class);
    }

    public function skills() {
        $this->hasMany(Skill::class);
    }
}
