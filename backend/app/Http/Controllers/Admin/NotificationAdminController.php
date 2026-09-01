<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;

class NotificationAdminController extends Controller
{
    use ApiResponse;

    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $notifications = $request->user()
            ->notifications()
            ->limit(50)
            ->get()
            ->map(fn ($n) => [
                'id' => $n->id,
                'data' => is_string($n->data) ? json_decode($n->data, true) : $n->data,
                'read_at' => $n->read_at,
                'created_at' => $n->created_at,
            ]);

        return $this->success([
            'notifications' => $notifications,
            'unread_count' => $request->user()->unreadNotifications()->count(),
        ], 'Notifications retrieved successfully');
    }

    public function unreadCount(Request $request): \Illuminate\Http\JsonResponse
    {
        return $this->success([
            'unread_count' => $request->user()->unreadNotifications()->count(),
        ], 'Unread count retrieved');
    }

    public function markRead(Request $request, string $id): \Illuminate\Http\JsonResponse
    {
        $request->user()->notifications()->where('id', $id)->first()?->markAsRead();

        return $this->success(null, 'Notification marked as read');
    }

    public function markAllRead(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return $this->success(null, 'All notifications marked as read');
    }
}