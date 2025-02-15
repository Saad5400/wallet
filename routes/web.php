<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/login', fn() => redirect('welcome'))->name('login');
Route::get('/', fn() => Auth::guest() ? redirect('welcome') : redirect('dashboard'));

Route::group([
    'middleware' => 'guest',
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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
