<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::table('sales_orders', function (Blueprint $table) {
            $table->dropUnique('sales_orders_number_unique');
            $table->unique(['tenant_id', 'number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::table('sales_orders', function (Blueprint $table) {
            $table->dropUnique(['tenant_id', 'number']);
            $table->unique('number');
        });
    }
};
