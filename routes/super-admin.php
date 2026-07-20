<?php

use App\Http\Controllers\SuperAdmin\AuthController;
use App\Http\Controllers\SuperAdmin\DashboardController;
use App\Http\Controllers\SuperAdmin\PaymentController;
use App\Http\Controllers\SuperAdmin\PlanController;
use App\Http\Controllers\SuperAdmin\SubscriptionController;
use App\Http\Controllers\SuperAdmin\TenantController;
use Illuminate\Support\Facades\Route;

Route::middleware(['guest:super_admin'])->prefix('super-admin/auth')->group(function () {
    Route::get('login', [AuthController::class, 'login'])->name('super-admin.login');
    Route::post('login', [AuthController::class, 'store'])->name('super-admin.login.attempt');
});

Route::middleware(['auth:super_admin'])->prefix('super-admin')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('super-admin.dashboard');

    Route::resource('plans', PlanController::class)->names('super-admin.plans')->except(['show']);
    Route::resource('tenants', TenantController::class)->names('super-admin.tenants');

    Route::prefix('subscriptions')->name('super-admin.subscriptions.')->controller(SubscriptionController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{subscription}', 'show')->name('show');
        Route::post('/{subscription}/cancel', 'cancel')->name('cancel');
        Route::post('/{subscription}/change-plan', 'changePlan')->name('change-plan');
    });

    Route::get('payments', [PaymentController::class, 'index'])->name('super-admin.payments.index');

    Route::post('logout', [AuthController::class, 'destroy'])->name('super-admin.logout');
});
