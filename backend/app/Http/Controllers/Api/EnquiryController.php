<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEnquiryRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Enquiry;
use App\Notifications\NewEnquiryAdminNotification;
use Illuminate\Support\Facades\Notification;

class EnquiryController extends Controller
{
    use ApiResponse;

    public function store(StoreEnquiryRequest $request): \Illuminate\Http\JsonResponse
    {
        $enquiry = Enquiry::create($request->validated() + [
            'user_id' => $request->user()?->id,
            'status' => 'new',
            'source' => $request->input('source', 'listing'),
        ]);

        // Notify staff/admin users.
        $admins = \App\Models\User::whereHas('roles', fn ($q) => $q->whereIn('slug', ['super-admin', 'admin', 'staff']))
            ->where('status', 'active')
            ->get();

        Notification::send($admins, new NewEnquiryAdminNotification($enquiry));

        return $this->created([
            'id' => $enquiry->id,
        ], 'Thank you! Your enquiry has been received. A DECORUM representative will contact you shortly.');
    }
}