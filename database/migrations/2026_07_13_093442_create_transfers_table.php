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
        Schema::create('transfers', function (Blueprint $table) {
            $table->id();
            $table->string('transfer_number');
            $table->foreignId('source_warehouse_id')->constrained('warehouses')->nullOnDelete();
            $table->foreignId('source_location_id')->constrained('locations')->nullOnDelete();
            $table->foreignId('destination_warehouse_id')->constrained('warehouses')->nullOnDelete();
            $table->foreignId('destination_location_id')->constrained('locations')->nullOnDelete();
            $table->enum('status', ['draft', 'pending_approval', 'approved', 'processing', 'cancelled', 'complete'])->default('draft');
            $table->text('notes')->nullable();
            $table->foreignId('requested_by')->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('received_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->timestamp('requested_at');
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('received_at')->nullable();
            $table->timestamps();

            $table->unique(['transfer_number', 'tenant_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transfers');
    }
};
