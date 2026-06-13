<?php

use App\Http\Controllers\SuperAdmin\AuthController;
use App\Http\Controllers\SuperAdmin\DashboardController;
use App\Http\Controllers\SuperAdmin\PlanController;
use Illuminate\Support\Facades\Route;

Route::middleware(['guest:super_admin'])->prefix('super-admin')->group(function () {
    Route::get('login', [AuthController::class, 'login'])->name('super-admin.login');
    Route::post('login', [AuthController::class, 'store'])->name('super-admin.login.attempt');
});

Route::middleware(['auth:super_admin'])->prefix('super-admin')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('super-admin.dashboard');

    Route::resource('plans', PlanController::class)->names('super-admin.plans')->except(['show']);

    Route::post('logout', [AuthController::class, 'destroy'])->name('super-admin.logout');
});
