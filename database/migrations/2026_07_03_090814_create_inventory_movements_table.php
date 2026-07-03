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
        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('item_id')->nullable();
            $table->unsignedBigInteger('variant_id')->nullable();
            $table->foreignId('warehouse_id')->nullable()->constrained('warehouses')->nullOnDelete();
            $table->foreignId('location_id')->nullable()->constrained('locations')->nullOnDelete();
            $table->string('reference_type');
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->string('direction');
            $table->decimal('quantity', 15, 4);
            $table->decimal('unit_cost', 15, 4)->nullable();
            $table->decimal('balance_after', 15, 4)->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('performed_by')->nullable()->constrained('users')->nullOnDelete();

            $table->index(['tenant_id', 'item_id', 'warehouse_id', 'location_id'], 'inventory_movements_scope_index');
            $table->index(['tenant_id', 'reference_type', 'reference_id'], 'inventory_movements_reference_index');
            $table->index(['tenant_id', 'direction'], 'inventory_movements_direction_index');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_movements');
    }
};
