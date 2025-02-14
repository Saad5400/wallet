<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => Auth::guest() ? redirect('welcome') : redirect('dashboard'));

Route::get('/welcome', [WelcomeController::class, 'index'])->name('welcome');
Route::get('/welcome/email', [WelcomeController::class, 'email'])->name('welcome.enterEmail');
Route::post('/welcome/email', [WelcomeController::class, 'requestOtp'])->name('welcome.requestOtp')->middleware('throttle:5,10'); // 5 attempts in 10 minutes
Route::get('/welcome/email/otp', [WelcomeController::class, 'enterOtp'])->name('welcome.enterOtp');
Route::post('/welcome/email/otp', [WelcomeController::class, 'validateOtp'])->name('welcome.validateOtp');
Route::get('/welcome/profile', [WelcomeController::class, 'completeProfile'])->name('welcome.completeProfile');
Route::post('/welcome/profile', [WelcomeController::class, 'saveProfile'])->name('welcome.saveProfile');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
