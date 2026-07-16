<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_order_id')->constrained('purchase_orders')->cascadeOnDelete();
            $table->foreignId('item_id')->constrained('items');
            $table->decimal('quantity_ordered', 14, 4);
            $table->decimal('quantity_received', 14, 4)->default(0);
            $table->decimal('unit_cost', 14, 4);
            $table->decimal('discount', 14, 4)->default(0);
            $table->decimal('tax', 14, 4)->default(0);
            $table->decimal('total', 14, 4)->default(0);
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_order_items');
    }
};
