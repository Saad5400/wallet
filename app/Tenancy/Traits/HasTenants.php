<?php

declare(strict_types=1);

namespace App\Tenancy\Traits;

use App\Tenancy\Database\TenantMorphScope;

trait HasTenants
{
    /**
     * The name of the pivot table used for the polymorphic relationship.
     */
    public static $tenantPivotTable = 'tenantables';

    /**
     * The foreign key on the pivot table that references the tenant model.
     */
    public static $tenantForeignKey = 'tenant_id';

    /**
     * The morph name used for this polymorphic relation.
     */
    public static $morphName = 'tenantable';

    /**
     * The name of the column on the tenantables table that references the tenantable model.
     */
    public static $tenantableIdColumn = 'tenantable_id';

    /**
     * Define a polymorphic many-to-many relationship with the Tenant model.
     *
     * This assumes your tenant model is set in your config at:
     * config('tenancy.tenant_model')
     */
    public function tenants()
    {
        return $this->morphToMany(
            config('tenancy.tenant_model'),
            static::$morphName,             // The morph name used for this polymorphic relation
            static::$tenantPivotTable,      // The pivot table name (tenantables)
            static::$tenantableIdColumn,    // The local key on the pivot table (User's integer ID)
            static::$tenantForeignKey,      // The foreign key on the pivot table (Tenant's UUID)
        );
    }


    /**
     * Boot the trait to add a global scope and automatically attach the current tenant.
     */
    public static function bootHasTenants()
    {
        // Add a global scope so that queries on models using this trait are
        // automatically filtered to include only those associated with the current tenant.
        static::addGlobalScope(new TenantMorphScope);

        // When a new model is created, automatically attach the current tenant
        // if tenancy is initialized and no tenant has been attached yet.
        static::created(function ($model) {
            if (function_exists('tenancy') && tenancy()->initialized) {
                if (!$model->relationLoaded('tenants') || $model->tenants->isEmpty()) {
                    $model->tenants()->attach(tenant()->getTenantKey());
                }
            }
        });
    }
}
