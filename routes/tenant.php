<?php

declare(strict_types=1);

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

    Route::get('/', function () {
        return 'This is your multi-tenant application. The id of the current tenant is ' . tenant('id');
    })->name('home');

});

