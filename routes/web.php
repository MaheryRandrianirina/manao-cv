<?php

use App\Http\Controllers\API\UserController;
use App\Http\Controllers\AppController;
use App\Http\Controllers\CvController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware("auth")->group(function(){
    Route::get('/', [AppController::class, "index"])->name('home');

    Route::post('/password/edit', [UserController::class, "update"])->name('password.edit');

    Route::get("/cv/{id}", [CvController::class, "index"]);

    Route::get("/test/download", [CvController::class, "test"]);
    Route::post("/cv/save", [CvController::class, "save"]);

    Route::post("/cv/download", [CvController::class, "download"]);
});

require __DIR__.'/auth.php';
