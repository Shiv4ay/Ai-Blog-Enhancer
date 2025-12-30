<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'excerpt',
        'author',
        'published_at',
        'source_url',
        'is_optimized',
        'original_article_id',
        'references',
    ];

    protected $casts = [
        'is_optimized' => 'boolean',
        'published_at' => 'datetime',
        'references' => 'array',
    ];
}
