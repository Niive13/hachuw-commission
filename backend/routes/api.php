<?php
use App\Http\Controllers\Api\AdminArtworkController;
use App\Http\Controllers\Api\PublicArtworkController;
use App\Http\Controllers\Api\AdminCatalogController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AdminSettingController;
use App\Http\Controllers\Api\PublicSettingController;
use App\Http\Controllers\Api\AdminPortfolioImageController;
use App\Http\Controllers\Api\AdminQueueController;
use App\Http\Controllers\Api\AdminKategoriController;
use App\Http\Controllers\Api\PublicKategoriController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicCatalogController;
use App\Http\Controllers\Api\PublicQueueController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API
|--------------------------------------------------------------------------
*/

Route::prefix('catalog')->group(function () {
    Route::get('/',     [PublicCatalogController::class, 'index']);
    Route::get('/{id}', [PublicCatalogController::class, 'show'])->whereNumber('id');
});

Route::get('/queue', [PublicQueueController::class, 'index']);
Route::get('/kategori', [PublicKategoriController::class, 'index']);
Route::get('/settings', [\App\Http\Controllers\Api\PublicSettingController::class, 'index']);
Route::get('/artworks', [PublicArtworkController::class, 'index']);
/*
|--------------------------------------------------------------------------
| Auth API
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:login');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me',      [AuthController::class, 'me']);
    });
});

/*
|--------------------------------------------------------------------------
| Admin API (Protected)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    // Dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index']);

    // Open Close Comission
    Route::get('/settings', [AdminSettingController::class, 'index']);
    Route::put('/settings', [AdminSettingController::class, 'update']);

    // Artworks (8 slot)
    Route::get('/artworks',                  [AdminArtworkController::class, 'index']);
    Route::post('/artworks/{id}/image',      [AdminArtworkController::class, 'updateImage'])->whereNumber('id');
    Route::delete('/artworks/{id}/image',    [AdminArtworkController::class, 'clearImage'])->whereNumber('id');

    // Catalog CRUD
    Route::get('/catalog',         [AdminCatalogController::class, 'index']);
    Route::get('/catalog/{id}',    [AdminCatalogController::class, 'show'])->whereNumber('id');
    Route::post('/catalog',        [AdminCatalogController::class, 'store']);
    Route::put('/catalog/{id}',    [AdminCatalogController::class, 'update'])->whereNumber('id');
    Route::delete('/catalog/{id}', [AdminCatalogController::class, 'destroy'])->whereNumber('id');

    // Portfolio images
    Route::post('/catalog/{id}/images',  [AdminPortfolioImageController::class, 'store'])->whereNumber('id');
    Route::delete('/portfolio/{id}',     [AdminPortfolioImageController::class, 'destroy'])->whereNumber('id');

    // Queue CRUD
    Route::get('/queue',         [AdminQueueController::class, 'index']);
    Route::post('/queue',        [AdminQueueController::class, 'store']);
    Route::put('/queue/reorder', [AdminQueueController::class, 'reorder']);  // ← SEBELUM {id}
    Route::put('/queue/{id}',    [AdminQueueController::class, 'update'])->whereNumber('id');
    Route::delete('/queue/{id}', [AdminQueueController::class, 'destroy'])->whereNumber('id');

    // Kategori 
    Route::get('/kategori',         [AdminKategoriController::class, 'index']);
    Route::post('/kategori',        [AdminKategoriController::class, 'store']);
    Route::put('/kategori/{id}',    [AdminKategoriController::class, 'update'])->whereNumber('id');
    Route::delete('/kategori/{id}', [AdminKategoriController::class, 'destroy'])->whereNumber('id');
});