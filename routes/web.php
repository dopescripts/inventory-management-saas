<?php

use App\Http\Controllers\Inventory\AdjustmentController;
use App\Http\Controllers\Inventory\BrandController;
use App\Http\Controllers\Inventory\CategoryController;
use App\Http\Controllers\Inventory\ItemController;
use App\Http\Controllers\Inventory\TransferController;
use App\Http\Controllers\Inventory\TransferWorkflowController;
use App\Http\Controllers\Inventory\UnitController;
use App\Http\Controllers\Inventory\VendorController;
use App\Http\Controllers\Inventory\WarehouseController;
use App\Http\Controllers\Inventory\WarehouseLocationController;
use App\Http\Controllers\Purchasing\PurchaseBillController;
use App\Http\Controllers\Purchasing\PurchaseOrderController;
use App\Http\Controllers\Purchasing\PurchaseWorkflowController;
use App\Http\Controllers\Sales\CustomerController;
use App\Http\Controllers\Sales\SalesOrderController;
use App\Http\Controllers\Sales\SalesWorkflowController;
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

    Route::prefix('purchases')
        ->name('purchases.')
        ->controller(PurchaseOrderController::class)
        ->group(function () {

            Route::get('/', 'index')
                ->middleware('permission:view_purchases')
                ->name('index');

            Route::get('/create', 'create')
                ->middleware('permission:create_purchases')
                ->name('create');

            Route::post('/', 'store')
                ->middleware('permission:create_purchases')
                ->name('store');

            Route::get('/{purchase_order}', 'show')
                ->middleware('permission:view_purchases')
                ->name('show');

            Route::get('/{purchase_order}/edit', 'edit')
                ->middleware('permission:update_purchases')
                ->name('edit');

            Route::put('/{purchase_order}', 'update')
                ->middleware('permission:update_purchases')
                ->name('update');

            Route::delete('/{purchase_order}', 'destroy')
                ->middleware('permission:delete_purchases')
                ->name('destroy');
        });

    Route::controller(PurchaseWorkflowController::class)
        ->prefix('purchases/{purchase_order}')
        ->name('purchases.')
        ->group(function () {

            Route::post('/submit', 'submit')
                ->middleware('permission:submit_purchases')
                ->name('submit');

            Route::post('/approve', 'approve')
                ->middleware('permission:approve_purchases')
                ->name('approve');

            Route::post('/receive', 'receive')
                ->middleware('permission:receive_purchases')
                ->name('receive');

            Route::post('/cancel', 'cancel')
                ->middleware('permission:cancel_purchases')
                ->name('cancel');

            Route::post('/close', 'close')
                ->middleware('permission:close_purchases')
                ->name('close');
        });

    Route::resource('vendors', VendorController::class)->except(['show']);

    Route::prefix('bills')
        ->name('bills.')
        ->controller(PurchaseBillController::class)
        ->group(function () {

            Route::get('/', 'index')
                ->middleware('permission:view_bills')
                ->name('index');

            Route::get('/create', 'create')
                ->middleware('permission:create_bills')
                ->name('create');

            Route::post('/', 'store')
                ->middleware('permission:create_bills')
                ->name('store');

            Route::get('/{bill}', 'show')
                ->middleware('permission:view_bills')
                ->name('show');

            Route::put('/{bill}', 'update')
                ->middleware('permission:update_bills')
                ->name('update');

            Route::delete('/{bill}', 'destroy')
                ->middleware('permission:delete_bills')
                ->name('destroy');

            Route::get('/{bill}/download', 'download')
                ->middleware('permission:view_bills')
                ->name('download');

            Route::post('/{bill}/mark-paid', 'markAsPaid')
                ->middleware('permission:update_bills')
                ->name('mark-paid');

            Route::post('/{bill}/cancel', 'cancel')
                ->middleware('permission:update_bills')
                ->name('cancel');
        });

    Route::resource('customers', CustomerController::class);

    Route::prefix('orders')->name('orders.')->group(function () {
        Route::post('/{order}/confirm', [SalesWorkflowController::class, 'confirm'])
            ->middleware('permission:update_bills') // Should be a sales permission eventually
            ->name('confirm');

        Route::post('/{order}/cancel', [SalesWorkflowController::class, 'cancel'])
            ->middleware('permission:update_bills')
            ->name('cancel');
    });

    Route::resource('orders', SalesOrderController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/super-admin.php';
