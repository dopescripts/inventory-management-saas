<?php

use App\Http\Controllers\Inventory\WarehouseController;
use App\Http\Controllers\Inventory\WarehouseLocationController;
use App\Http\Controllers\StaffController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', 'tenant.permission'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::middleware('role:owner|manager')->group(function () {
        Route::resource('staff', StaffController::class)->except(['show']);
    });

    Route::resource('warehouses', WarehouseController::class)->middleware([
        'index' => 'permission:view_warehouses',
        'create' => 'permission:create_warehouses',
        'store' => 'permission:create_warehouses',
        'edit' => 'permission:update_warehouses',
        'update' => 'permission:update_warehouses',
        'destroy' => 'permission:delete_warehouses',
    ]);
    Route::get('warehouses/{warehouse}/locations/create', [WarehouseLocationController::class, 'create'])
        ->name('warehouses.locations.create')
        ->middleware('permission:create_warehouses');
    Route::post('warehouses/{warehouse}/locations', [WarehouseLocationController::class, 'store'])
        ->name('warehouses.locations.store')
        ->middleware('permission:create_warehouses');
});

require __DIR__.'/settings.php';
require __DIR__.'/super-admin.php';
