<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Account extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'name',
        'cashback_rate',
    ];

    protected $casts = [
        'cashback_rate' => 'float',
    ];

    public function records(): HasMany
    {
        return $this->hasMany(Record::class);
    }
}
