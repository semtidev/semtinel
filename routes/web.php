<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AppController;
use App\Http\Controllers\StructureController;
use App\Http\Controllers\LogisticsController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;


//Auth::routes();

Route::get('login', [AppController::class, "login"])->name('login');

Route::middleware('sanctum.auth')->group(function () {
    Route::get('/', [AppController::class, "index"])->name('app');
    Route::get('tree_structures', [StructureController::class, "treeStructures"])->name('tree_structures');
    Route::get('admin', [AdminController::class, "index"])->name('app.web.admin');
    Route::get('logistics', [LogisticsController::class, "index"])->name('app.web.logistics');
});

Route::get('logout', [AuthController::class, "logout"])->name('logout');

Route::view('admin/{any}', 'admin')
    ->middleware(['auth'])
    ->where('any', '.*');

Route::view('logistics/{any}', 'logistics')
    ->middleware(['auth'])
    ->where('any', '.*');