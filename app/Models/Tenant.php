<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Stancl\Tenancy\Contracts\Tenant as TenantContract;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;

class Tenant extends BaseTenant implements TenantContract
{
    protected $keyType = 'string';

    public function users()
    {
        return $this->morphedByMany(User::class, User::$morphName, User::$tenantPivotTable, User::$tenantForeignKey, 'tenantable_id');
    }

    public function accounts()
    {
        return $this->hasMany(Account::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function subCategories()
    {
        return $this->hasMany(SubCategory::class);
    }

    public function records()
    {
        return $this->hasMany(Record::class);
    }

    public function balance(): Attribute
    {
        return Attribute::make(function () {
            return $this->accounts->sum('balance');
        });
    }
}
