<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('vendor_id')->constrained('vendors')->cascadeOnDelete();
            $table->string('purchase_number');
            $table->string('status')->default('draft');
            $table->date('expected_date')->nullable();
            $table->foreignId('ordered_by')->constrained('users');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->decimal('subtotal', 14, 4)->default(0);
            $table->decimal('discount', 14, 4)->default(0);
            $table->decimal('tax', 14, 4)->default(0);
            $table->decimal('shipping', 14, 4)->default(0);
            $table->decimal('total', 14, 4)->default(0);
            $table->text('notes')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();

            $table->unique(['tenant_id', 'purchase_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_orders');
    }
};
