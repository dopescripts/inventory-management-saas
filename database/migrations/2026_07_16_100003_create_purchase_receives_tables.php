<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_receives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('purchase_order_id')->constrained('purchase_orders')->cascadeOnDelete();
            $table->foreignId('warehouse_id')->constrained('warehouses');
            $table->foreignId('received_by')->constrained('users');
            $table->timestamp('received_at');
            $table->string('reference')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('purchase_receive_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_receive_id')->constrained('purchase_receives')->cascadeOnDelete();
            $table->foreignId('purchase_order_item_id')->constrained('purchase_order_items');
            $table->foreignId('item_id')->constrained('items');
            $table->foreignId('location_id')->nullable()->constrained('locations');
            $table->decimal('quantity', 14, 4);
            $table->decimal('unit_cost', 14, 4);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_receive_items');
        Schema::dropIfExists('purchase_receives');
    }
};
