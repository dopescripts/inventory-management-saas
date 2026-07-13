<?php

use App\Http\Controllers\Inventory\AdjustmentController;
use App\Http\Controllers\Inventory\BrandController;
use App\Http\Controllers\Inventory\CategoryController;
use App\Http\Controllers\Inventory\ItemController;
use App\Http\Controllers\Inventory\TransferController;
use App\Http\Controllers\Inventory\TransferWorkflowController;
use App\Http\Controllers\Inventory\UnitController;
use App\Http\Controllers\Inventory\WarehouseController;
use App\Http\Controllers\Inventory\WarehouseLocationController;
use App\Http\Controllers\StaffController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', 'tenant.permission'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard')->middleware('role:manager|owner|staff');

    Route::middleware('role:owner|manager')->group(function () {
        Route::resource('staff', StaffController::class)->except(['show']);
    });

    Route::resource('warehouses', WarehouseController::class);
    Route::get('warehouses/{warehouse}/locations/create', [WarehouseLocationController::class, 'create'])
        ->name('warehouses.locations.create')
        ->middleware('permission:create_warehouses');
    Route::post('warehouses/{warehouse}/locations', [WarehouseLocationController::class, 'store'])
        ->name('warehouses.locations.store')
        ->middleware('permission:create_warehouses');

    Route::prefix('transfers')
        ->name('transfers.')
        ->controller(TransferController::class)
        ->group(function () {

            Route::get('/', 'index')
                ->middleware('permission:view_transfers')
                ->name('index');

            Route::get('/create', 'create')
                ->middleware('permission:create_transfers')
                ->name('create');

            Route::post('/', 'store')
                ->middleware('permission:create_transfers')
                ->name('store');

            Route::get('/{transfer}', 'show')
                ->middleware('permission:view_transfers')
                ->name('show');

            Route::get('/{transfer}/edit', 'edit')
                ->middleware('permission:update_transfers')
                ->name('edit');

            Route::put('/{transfer}', 'update')
                ->middleware('permission:update_transfers')
                ->name('update');

            Route::delete('/{transfer}', 'destroy')
                ->middleware('permission:delete_transfers')
                ->name('destroy');
        });
    Route::controller(TransferWorkflowController::class)
        ->prefix('transfers/{transfer}')
        ->name('transfers.')
        ->group(function () {

            Route::post('/submit', 'submit')
                ->middleware('permission:submit_transfers')
                ->name('submit');

            Route::post('/approve', 'approve')
                ->middleware('permission:approve_transfers')
                ->name('approve');

            Route::post('/ship', 'ship')
                ->middleware('permission:ship_transfers')
                ->name('ship');

            Route::post('/receive', 'receive')
                ->middleware('permission:receive_transfers')
                ->name('receive');

            Route::post('/cancel', 'cancel')
                ->middleware('permission:cancel_transfers')
                ->name('cancel');
        });

    Route::resource('categories', CategoryController::class)->except(['show']);

    Route::resource('brands', BrandController::class)->except(['show']);

    Route::resource('units', UnitController::class)->except(['show']);

    Route::resource('items', ItemController::class)->except(['show']);

    Route::resource('adjustments', AdjustmentController::class)->only(['index', 'create', 'store']);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/super-admin.php';
