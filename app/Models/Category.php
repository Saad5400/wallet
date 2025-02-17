<?php

namespace App\Models;

use App\Enums\RecordType;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Category extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'name',
        'type',
        'color',
        'icon',
    ];

    protected $casts = [
        'type' => RecordType::class,
    ];

    public function subCategories()
    {
        return $this->hasMany(SubCategory::class);
    }

    public function records()
    {
        return $this->hasMany(Record::class);
    }
}
