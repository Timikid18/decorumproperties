<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSellRequestRequest;
use App\Http\Resources\SellRequestResource;
use App\Http\Responses\ApiResponse;
use App\Models\SellRequest;
use App\Notifications\NewSellRequestAdminNotification;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class SellRequestController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected FileUploadService $files,
    ) {}

    public function store(StoreSellRequestRequest $request): \Illuminate\Http\JsonResponse
    {
        $data = $request->safe()->except(['images', 'documents']);
        $data['documents'] = $request->input('documents', []);
        $data['user_id'] = $request->user()?->id;

        $sellRequest = SellRequest::create($data);

        if ($request->hasFile('images')) {
            $isFirst = true;
            foreach ($request->file('images') as $file) {
                $stored = $this->files->storeImage($file, 'sell-requests');
                $sellRequest->images()->create($stored + [
                    'is_main' => $isFirst,
                    'sort_order' => $sellRequest->images()->count(),
                ]);
                $isFirst = false;
            }
        }

        $admins = \App\Models\User::whereHas('roles', fn ($q) => $q->whereIn('slug', ['super-admin', 'admin', 'staff']))
            ->where('status', 'active')
            ->get();

        Notification::send($admins, new NewSellRequestAdminNotification($sellRequest));

        return $this->created([
            'id' => $sellRequest->id,
        ], 'Thank you. Your submission has been received. A DECORUM representative will contact you shortly.');
    }

    public function my(Request $request): \Illuminate\Http\JsonResponse
    {
        $items = SellRequest::query()
            ->with(['images', 'category'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(12);

        return $this->success([
            'submissions' => SellRequestResource::collection($items->items()),
            'pagination' => [
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(),
                'total' => $items->total(),
            ],
        ], 'Your submissions retrieved successfully');
    }
}