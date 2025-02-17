<?php

namespace App\Models;

use Stancl\Tenancy\Contracts\Tenant as TenantContract;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;

class Tenant extends BaseTenant implements TenantContract
{
    protected $keyType = 'string';

    public function users()
    {
        return $this->morphedByMany(User::class, User::$morphName, User::$tenantPivotTable, User::$tenantForeignKey, 'tenantable_id');
    }
}
