<?php

declare(strict_types=1);

namespace App\Tenancy\Database;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class TenantMorphScope implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        // If tenancy isn't initialized, don't apply the scope
        if (! function_exists('tenancy') || ! tenancy()->initialized) {
            return;
        }

        // Filter by models that have a tenant matching the current tenant's ID
        $builder->whereHas('tenants', function (Builder $query) {
            $query->where('id', tenant()->getTenantKey());
        });
    }

    public function extend(Builder $builder)
    {
        // Provide a convenient macro to remove this global scope
        $builder->macro('withoutTenancy', function (Builder $builder) {
            return $builder->withoutGlobalScope($this);
        });
    }
}
