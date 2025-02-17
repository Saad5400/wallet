<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class SubCategory extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'category_id',
        'name',
        'color',
        'icon',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function records()
    {
        return $this->hasMany(Record::class);
    }
}
