<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->timestamp('onboarding_completed_at')->nullable()->after('tax_id');
        });

        // Backfill: a tenant is onboarded if any of its users already completed onboarding.
        DB::table('tenants')->update([
            'onboarding_completed_at' => DB::raw(
                '(select min(users.onboarding_completed_at) from users '.
                'where users.tenant_id = tenants.id and users.onboarding_completed_at is not null)'
            ),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn('onboarding_completed_at');
        });
    }
};
