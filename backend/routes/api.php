<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\HostController;
use App\Http\Controllers\Api\PropertyController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes for LuxeStay
|--------------------------------------------------------------------------
*/

// Authentication
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

// Properties
Route::prefix('properties')->group(function () {
    Route::get('/', [PropertyController::class, 'index']);
    Route::middleware('auth:sanctum')->post('/', [PropertyController::class, 'store']);
    Route::get('/{property:slug}', [PropertyController::class, 'show']);
    Route::post('/{property:slug}/calculate-price', [PropertyController::class, 'calculatePrice']);
    Route::get('/{property:slug}/check-availability', [PropertyController::class, 'checkAvailability']);
});

// Bookings
Route::prefix('bookings')->group(function () {
    Route::get('/', [BookingController::class, 'index']);
    Route::post('/', [BookingController::class, 'store']);
    Route::get('/{booking}', [BookingController::class, 'show']);
    Route::post('/{booking}/cancel', [BookingController::class, 'cancel']);
});

// Host Operations & Metrics
Route::prefix('host')->group(function () {
    Route::get('/dashboard', [HostController::class, 'dashboard']);
    Route::get('/bookings', [HostController::class, 'bookings']);
    Route::post('/bookings/{booking}/approve', [HostController::class, 'approve']);
    Route::post('/bookings/{booking}/decline', [HostController::class, 'decline']);
    Route::post('/properties/{property}/toggle-availability', [HostController::class, 'toggleAvailability']);
});

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'app' => 'LuxeStay API',
        'database' => 'PostgreSQL 15',
        'backend' => 'Laravel ' . app()->version(),
        'timestamp' => now()->toIso8601String(),
    ]);
});
