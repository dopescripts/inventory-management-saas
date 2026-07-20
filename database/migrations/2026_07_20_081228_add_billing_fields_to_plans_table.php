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
        Schema::table('plans', function (Blueprint $table) {
            $table->enum('billing_period', ['monthly', 'yearly'])->default('monthly')->after('price');
            $table->decimal('yearly_price', 10, 2)->nullable()->after('billing_period');
            $table->boolean('is_active')->default(true)->after('yearly_price');
            $table->integer('sort_order')->default(0)->after('is_active');
            $table->text('description')->nullable()->after('sort_order');
            $table->json('features')->nullable()->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn([
                'billing_period',
                'yearly_price',
                'is_active',
                'sort_order',
                'description',
                'features',
            ]);
        });
    }
};
