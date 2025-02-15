<?php

use App\Http\Controllers\WelcomeController;
use App\Http\Middleware\Guest;
use Illuminate\Support\Facades\Route;

Route::get('/', [WelcomeController::class, 'root']);
Route::get('/login', fn() => redirect()->route('welcome.index'));

Route::group([
    'middleware' => [
        Guest::class,
    ],
    'as' => 'welcome.',
    'prefix' => 'welcome',
], function () {
    Route::get('/', [WelcomeController::class, 'index'])->name('index');
    Route::get('/email', [WelcomeController::class, 'email'])->name('enterEmail');
    Route::post('/email', [WelcomeController::class, 'requestOtp'])->name('requestOtp');
    Route::get('/email/otp', [WelcomeController::class, 'enterOtp'])->name('enterOtp');
    Route::post('/email/otp', [WelcomeController::class, 'validateOtp'])->name('validateOtp');
});

Route::group([
    'middleware' => 'auth',
    'as' => 'welcome.',
    'prefix' => 'welcome',
], function () {
    Route::get('/profile', [WelcomeController::class, 'completeProfile'])->name('completeProfile');
    Route::post('/profile', [WelcomeController::class, 'saveProfile'])->name('saveProfile');
});
