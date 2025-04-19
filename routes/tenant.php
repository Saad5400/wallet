<?php

declare(strict_types=1);

use App\Http\Controllers\HomeController;
use App\Http\Controllers\AccountController;
use App\Http\Middleware\AuthorizeUserToTenant;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByPath;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/


Route::group([
    'middleware' => [
        'web',
        InitializeTenancyByPath::class,
        AuthorizeUserToTenant::class,
    ],
    'prefix' => '/{tenant}',
], function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');

    Route::get('/records', [HomeController::class, 'index'])->name('records');

    Route::get('/accounts', [HomeController::class, 'index'])->name('accounts');
    Route::post('/accounts', [AccountController::class, 'store'])->name('account.store');

    Route::get('/settings', [HomeController::class, 'index'])->name('settings');

    // Category endpoints
    Route::post('/categories', [\App\Http\Controllers\CategoryController::class, 'store'])->name('category.store');

    // Subcategory endpoints
    Route::post('/sub-categories', [\App\Http\Controllers\SubCategoryController::class, 'store'])->name('subCategory.store');

    // Record endpoints
    Route::post('/records', [\App\Http\Controllers\RecordController::class, 'store'])->name('record.store');
});
