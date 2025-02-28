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
        'name',
        'cashback_rate',
    ];

    public function records(): HasMany
    {
        return $this->hasMany(Record::class);
    }

    public function balance(): Attribute
    {
        return Attribute::make(function () {
            return $this->records->sum('amount');
        });
    }
}
