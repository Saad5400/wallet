<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tenantables', function (Blueprint $table) {
            $table->string('tenant_id');
            $table->unsignedBigInteger('tenantable_id');
            $table->string('tenantable_type');
            
            // You can add timestamps if you want to track created_at / updated_at:
            $table->timestamps();

            $table->index(['tenant_id', 'tenantable_id']);

            // If you're using MySQL 5.7+ or MariaDB 10.2.2+ and want to add a foreign key:
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenantables');
    }
};
