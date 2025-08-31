<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $table = 'posts';

    protected $fillable = ['title', 'content', 'user_id'];

    // Relationship: a post belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
