<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Account extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'name',
        'cashback_rate',
    ];

    public function incomingRecords()
    {
        return $this->hasMany(Record::class, 'destination_account_id');
    }

    public function outgoingRecords()
    {
        return $this->hasMany(Record::class, 'source_account_id');
    }

    public function balance(): Attribute
    {
        return Attribute::make(function () {
            return $this->incomingRecords->sum('amount') - $this->outgoingRecords->sum('amount');
        });
    }
}
