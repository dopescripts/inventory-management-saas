<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->foreignId('default_currency_id')->nullable()->constrained('currencies')->nullOnDelete();
            $table->text('billing_address')->nullable();
            $table->string('billing_phone')->nullable();
            $table->string('billing_email')->nullable();
            $table->string('tax_id')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropConstrainedForeignId('default_currency_id');
            $table->dropColumn(['billing_address', 'billing_phone', 'billing_email', 'tax_id']);
        });
    }
};
