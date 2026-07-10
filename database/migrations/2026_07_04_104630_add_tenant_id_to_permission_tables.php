<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add the tenant_id (team_foreign_key) column to Spatie permission pivot tables.
     * This is required when teams support was enabled after the initial migration.
     */
    public function up(): void
    {
        $teamForeignKey = config('permission.column_names.team_foreign_key', 'team_id');

        // Add tenant_id to roles table
        Schema::table('roles', function (Blueprint $table) use ($teamForeignKey) {
            if (! Schema::hasColumn('roles', $teamForeignKey)) {
                $table->unsignedBigInteger($teamForeignKey)->nullable()->after('id');
                $table->index($teamForeignKey, 'roles_team_foreign_key_index');
            }
        });

        // Add tenant_id to model_has_roles table
        Schema::table('model_has_roles', function (Blueprint $table) use ($teamForeignKey) {
            if (! Schema::hasColumn('model_has_roles', $teamForeignKey)) {
                $table->unsignedBigInteger($teamForeignKey)->nullable()->after('role_id');
                $table->index($teamForeignKey, 'model_has_roles_team_foreign_key_index');
            }
        });

        // Add tenant_id to model_has_permissions table
        Schema::table('model_has_permissions', function (Blueprint $table) use ($teamForeignKey) {
            if (! Schema::hasColumn('model_has_permissions', $teamForeignKey)) {
                $table->unsignedBigInteger($teamForeignKey)->nullable()->after('permission_id');
                $table->index($teamForeignKey, 'model_has_permissions_team_foreign_key_index');
            }
        });

        app('cache')
            ->store(config('permission.cache.store') != 'default' ? config('permission.cache.store') : null)
            ->forget(config('permission.cache.key'));
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $teamForeignKey = config('permission.column_names.team_foreign_key', 'team_id');

        Schema::table('roles', function (Blueprint $table) use ($teamForeignKey) {
            if (Schema::hasColumn('roles', $teamForeignKey)) {
                $table->dropIndex('roles_team_foreign_key_index');
                $table->dropColumn($teamForeignKey);
            }
        });

        Schema::table('model_has_roles', function (Blueprint $table) use ($teamForeignKey) {
            if (Schema::hasColumn('model_has_roles', $teamForeignKey)) {
                $table->dropIndex('model_has_roles_team_foreign_key_index');
                $table->dropColumn($teamForeignKey);
            }
        });

        Schema::table('model_has_permissions', function (Blueprint $table) use ($teamForeignKey) {
            if (Schema::hasColumn('model_has_permissions', $teamForeignKey)) {
                $table->dropIndex('model_has_permissions_team_foreign_key_index');
                $table->dropColumn($teamForeignKey);
            }
        });
    }
};
