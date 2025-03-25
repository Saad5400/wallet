<?php

namespace App\Models;

use App\Enums\RecordType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Category extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'name',
        'type',
        'color',
        'icon',
    ];

    protected $casts = [
        'type' => RecordType::class,
    ];

    public function subCategories(): HasMany
    {
        return $this->hasMany(SubCategory::class);
    }

    public function records(): HasMany
    {
        return $this->hasMany(Record::class);
    }
}
