<?php

use App\Http\Controllers\Inventory\WarehouseController;
use App\Http\Controllers\Inventory\WarehouseLocationController;
use App\Http\Controllers\Inventory\CategoryController;
use App\Http\Controllers\Inventory\BrandController;
use App\Http\Controllers\Inventory\UnitController;
use App\Http\Controllers\Inventory\ItemController;
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

    Route::resource('categories', CategoryController::class)->except(['show'])->middleware([
        'index' => 'permission:view_categories',
        'create' => 'permission:create_categories',
        'store' => 'permission:create_categories',
        'edit' => 'permission:update_categories',
        'update' => 'permission:update_categories',
        'destroy' => 'permission:delete_categories',
    ]);

    Route::resource('brands', BrandController::class)->except(['show'])->middleware([
        'index' => 'permission:view_brands',
        'create' => 'permission:create_brands',
        'store' => 'permission:create_brands',
        'edit' => 'permission:update_brands',
        'update' => 'permission:update_brands',
        'destroy' => 'permission:delete_brands',
    ]);

    Route::resource('units', UnitController::class)->except(['show'])->middleware([
        'index' => 'permission:view_units',
        'create' => 'permission:create_units',
        'store' => 'permission:create_units',
        'edit' => 'permission:update_units',
        'update' => 'permission:update_units',
        'destroy' => 'permission:delete_units',
    ]);

    Route::resource('items', ItemController::class)->except(['show'])->middleware([
        'index' => 'permission:view_items',
        'create' => 'permission:create_items',
        'store' => 'permission:create_items',
        'edit' => 'permission:update_items',
        'update' => 'permission:update_items',
        'destroy' => 'permission:delete_items',
    ]);
});

require __DIR__.'/settings.php';
require __DIR__.'/super-admin.php';
