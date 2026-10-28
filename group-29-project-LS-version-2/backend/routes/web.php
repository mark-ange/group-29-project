<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and they will be assigned
| to the "web" middleware group. Enjoy building your application!
|
*/

Route::get('/', function () {
    return response()->json([
        'message' => 'Welcome to LuxeStay API',
        'documentation' => 'See /api routes for available endpoints',
    ]);
});
