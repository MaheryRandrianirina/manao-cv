<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cv extends Model
{
    use HasFactory;

    protected $fillable = [
        "name", "firstname", 
        "sex", "current_work", 
        "profile", "image", 
        "is_recorded", "created_at",
        "updated_at", "model"
    ];

    protected $table = "cvs";

    public function contact() {
        return $this->hasOne(Contact::class);
    }

    public function experiences() {
        return $this->hasMany(Experience::class);
    }

    public function formations() {
        return $this->hasMany(Formation::class);
    }

    public function hobbies() {
        return $this->hasMany(Hobby::class);
    }

    public function languages() {
        return $this->hasMany(Language::class);
    }

    public function skills() {
        return $this->hasMany(Skill::class);
    }
}
