<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_bills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('purchase_order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('purchase_receive_id')->nullable()->constrained()->nullOnDelete();
            $table->string('bill_number');
            $table->foreignId('currency_id')->constrained()->restrictOnDelete();
            $table->decimal('subtotal', 14, 4)->default(0);
            $table->decimal('discount', 14, 4)->default(0);
            $table->decimal('tax', 14, 4)->default(0);
            $table->decimal('total', 14, 4)->default(0);
            $table->string('status')->default('draft');
            $table->date('due_date')->nullable();
            $table->decimal('paid_amount', 14, 4)->default(0);
            $table->text('notes')->nullable();
            $table->timestamp('issued_at')->nullable();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();

            $table->unique(['tenant_id', 'bill_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_bills');
    }
};
