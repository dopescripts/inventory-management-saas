<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_bill_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_bill_id')->constrained()->cascadeOnDelete();
            $table->foreignId('purchase_order_item_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('item_id')->constrained()->restrictOnDelete();
            $table->string('description')->nullable();
            $table->decimal('quantity', 14, 4);
            $table->decimal('unit_cost', 14, 4);
            $table->decimal('discount', 14, 4)->default(0);
            $table->decimal('tax', 14, 4)->default(0);
            $table->decimal('total', 14, 4);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_bill_items');
    }
};
