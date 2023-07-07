<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function image()
    {
        return $this->hasOne(Images::class);
    }

    public function tag()
    {
        return $this->belongsToMany(Tags::class);
    }
}
