<?php

use App\Http\Controllers\Admin\CategoryAdminController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EnquiryAdminController;
use App\Http\Controllers\Admin\ListingAdminController;
use App\Http\Controllers\Admin\NotificationAdminController;
use App\Http\Controllers\Admin\SellRequestAdminController;
use App\Http\Controllers\Admin\SettingsAdminController;
use App\Http\Controllers\Admin\UserAdminController;
use App\Support\Permissions;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin API routes (prefix /api/admin)
|--------------------------------------------------------------------------
| These routes are guarded by auth:sanctum + the view-dashboard permission
| which is granted to super-admin, admin and staff roles. Individual
| permission middleware adds defense in depth per resource.
*/

Route::middleware('permission:'.Permissions::VIEW_DASHBOARD)->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Notifications
    Route::get('/notifications', [NotificationAdminController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationAdminController::class, 'unreadCount']);
    Route::post('/notifications/{id}/read', [NotificationAdminController::class, 'markRead']);
    Route::post('/notifications/read-all', [NotificationAdminController::class, 'markAllRead']);

    // Listings
    Route::middleware('permission:'.Permissions::MANAGE_LISTINGS)->group(function () {
        Route::get('/listings', [ListingAdminController::class, 'index']);
        Route::post('/listings', [ListingAdminController::class, 'store']);
        Route::get('/listings/{listing}', [ListingAdminController::class, 'show']);
        Route::put('/listings/{listing}', [ListingAdminController::class, 'update']);
        Route::delete('/listings/{listing}', [ListingAdminController::class, 'destroy']);
        Route::post('/listings/{listing}/restore', [ListingAdminController::class, 'restore']);
        Route::post('/listings/{listing}/slug', [ListingAdminController::class, 'regenerateSlug']);
        Route::delete('/listings/{listing}/images/{imageId}', [ListingAdminController::class, 'deleteImage']);
        Route::post('/listings/{listing}/images/{imageId}/main', [ListingAdminController::class, 'setMainImage']);

        Route::middleware('permission:'.Permissions::PUBLISH_LISTINGS)->group(function () {
            Route::post('/listings/{listing}/publish', [ListingAdminController::class, 'publish']);
            Route::post('/listings/{listing}/unpublish', [ListingAdminController::class, 'unpublish']);
        });

        Route::middleware('permission:'.Permissions::FEATURE_LISTINGS)->group(function () {
            Route::post('/listings/{listing}/feature', [ListingAdminController::class, 'feature']);
        });

        Route::post('/listings/{listing}/mark-status', [ListingAdminController::class, 'markStatus']);
    });

    // Categories
    Route::middleware('permission:'.Permissions::MANAGE_CATEGORIES)->group(function () {
        Route::get('/category-groups', [CategoryAdminController::class, 'groups']);
        Route::post('/category-groups', [CategoryAdminController::class, 'storeGroup']);
        Route::put('/category-groups/{group}', [CategoryAdminController::class, 'updateGroup']);
        Route::delete('/category-groups/{group}', [CategoryAdminController::class, 'destroyGroup']);

        Route::get('/categories', [CategoryAdminController::class, 'index']);
        Route::post('/categories', [CategoryAdminController::class, 'store']);
        Route::put('/categories/{category}', [CategoryAdminController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryAdminController::class, 'destroy']);
    });

    // Enquiries
    Route::middleware('permission:'.Permissions::MANAGE_ENQUIRIES)->group(function () {
        Route::get('/enquiries', [EnquiryAdminController::class, 'index']);
        Route::get('/enquiries/{enquiry}', [EnquiryAdminController::class, 'show']);
        Route::patch('/enquiries/{enquiry}/status', [EnquiryAdminController::class, 'updateStatus']);
        Route::post('/enquiries/{enquiry}/notes', [EnquiryAdminController::class, 'addNote']);
        Route::delete('/enquiries/{enquiry}', [EnquiryAdminController::class, 'destroy']);
        Route::post('/enquiries/{id}/restore', [EnquiryAdminController::class, 'restore']);
        Route::delete('/enquiries/{id}/force', [EnquiryAdminController::class, 'forceDelete']);
    });

    // Sell requests
    Route::middleware('permission:'.Permissions::MANAGE_SELL_REQUESTS)->group(function () {
        Route::get('/sell-requests', [SellRequestAdminController::class, 'index']);
        Route::get('/sell-requests/{sellRequest}', [SellRequestAdminController::class, 'show']);
        Route::patch('/sell-requests/{sellRequest}/status', [SellRequestAdminController::class, 'updateStatus']);
        Route::post('/sell-requests/{sellRequest}/notes', [SellRequestAdminController::class, 'addNote']);
        Route::delete('/sell-requests/{sellRequest}', [SellRequestAdminController::class, 'destroy']);
    });

    // Users
    Route::middleware('permission:'.Permissions::MANAGE_USERS)->group(function () {
        Route::get('/users', [UserAdminController::class, 'index']);
        Route::get('/users/{user}', [UserAdminController::class, 'show']);
        Route::put('/users/{user}', [UserAdminController::class, 'update']);
        Route::post('/users/{user}/toggle-status', [UserAdminController::class, 'toggleStatus']);
    });

    // Settings & content
    Route::middleware('permission:'.Permissions::MANAGE_SETTINGS)->group(function () {
        Route::get('/settings', [SettingsAdminController::class, 'index']);
        Route::put('/settings', [SettingsAdminController::class, 'update']);
        Route::post('/settings/logo', [SettingsAdminController::class, 'uploadLogo']);
        Route::post('/settings/favicon', [SettingsAdminController::class, 'uploadFavicon']);
    });
});