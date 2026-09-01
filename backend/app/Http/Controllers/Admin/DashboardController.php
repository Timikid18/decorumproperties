<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Enquiry;
use App\Models\Listing;
use App\Models\SellRequest;
use App\Models\User;
use Carbon\Carbon;

class DashboardController extends Controller
{
    use ApiResponse;

    public function index(): \Illuminate\Http\JsonResponse
    {
        $now = Carbon::now();

        $listingsPerMonth = collect(range(5, 0))->map(function (int $back) use ($now) {
            $month = $now->copy()->subMonths($back);
            $end = $month->copy()->endOfMonth();

            return [
                'month' => $month->format('M y'),
                'listings' => Listing::withTrashed()
                    ->whereBetween('created_at', [$month->startOfMonth(), $end])
                    ->count(),
            ];
        });

        $enquiriesPerType = Enquiry::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return $this->success([
            'stats' => [
                'total_listings' => Listing::count(),
                'available_listings' => Listing::where('status', 'available')->where('is_published', true)->count(),
                'sold_items' => Listing::where('status', 'sold')->count(),
                'properties' => Listing::whereIn('listing_type', ['property', 'land'])->count(),
                'vehicles' => Listing::where('listing_type', 'automobile')->count(),
                'total_enquiries' => Enquiry::count(),
                'new_enquiries' => Enquiry::where('status', 'new')->count(),
                'sell_requests' => SellRequest::count(),
                'pending_sell_requests' => SellRequest::where('status', 'pending')->count(),
                'users' => User::count(),
                'featured_listings' => Listing::where('is_featured', true)->count(),
            ],
            'charts' => [
                'listings_per_month' => $listingsPerMonth,
                'enquiries_by_status' => $enquiriesPerType,
            ],
        ], 'Dashboard data retrieved successfully');
    }
}