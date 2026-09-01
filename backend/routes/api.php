<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DirectoryController;
use App\Http\Controllers\Api\EnquiryController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\ListingController;
use App\Http\Controllers\Api\MyAccountController;
use App\Http\Controllers\Api\SellRequestController;
use App\Http\Controllers\Api\SiteSettingController;
use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API routes
|--------------------------------------------------------------------------
*/

// Site-wide public data
Route::get('/site-settings', [SiteSettingController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/category-groups', [CategoryController::class, 'groups']);
Route::get('/testimonials', [TestimonialController::class, 'index']);

// Listings
Route::get('/listings', [ListingController::class, 'index']);
Route::get('/listings/featured', [ListingController::class, 'featured']);
Route::get('/listings/latest', [ListingController::class, 'latest']);
Route::get('/listings/search', [ListingController::class, 'search']);
Route::get('/listings/{slug}', [ListingController::class, 'show']);

// Sections
Route::get('/properties', [DirectoryController::class, 'properties']);
Route::get('/lands', [DirectoryController::class, 'lands']);
Route::get('/vehicles', [DirectoryController::class, 'vehicles']);
Route::get('/shop', [DirectoryController::class, 'shop']);

// Public submissions
Route::post('/enquiries', [EnquiryController::class, 'store']);
Route::post('/sell-requests', [SellRequestController::class, 'store']);

// Authentication
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

/*
|--------------------------------------------------------------------------
| Authenticated user routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Request $request) => new \App\Http\Resources\UserResource($request->user()->load('roles')));
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::put('/auth/password', [AuthController::class, 'updatePassword']);

    Route::get('/my/enquiries', [MyAccountController::class, 'enquiries']);
    Route::get('/my/sell-requests', [SellRequestController::class, 'my']);

    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{listing}', [FavoriteController::class, 'destroy']);
});

/*
|--------------------------------------------------------------------------
| Admin routes (loaded from routes/admin.php)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')
    ->middleware(['auth:sanctum', 'permission:view-dashboard'])
    ->group(base_path('routes/admin.php'));