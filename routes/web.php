<?php

use App\Http\Controllers\StaffController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', 'tenant.permission'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::middleware('role:owner|manager')->group(function () {
        Route::resource('staff', StaffController::class)->except(['show']);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/super-admin.php';
