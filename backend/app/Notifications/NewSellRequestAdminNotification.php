<?php

namespace App\Notifications;

use App\Models\SellRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewSellRequestAdminNotification extends Notification
{
    use Queueable;

    public function __construct(
        public SellRequest $sellRequest,
    ) {}

    /** @return array<int, string> */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_sell_request',
            'title' => 'New sell request',
            'body' => $this->sellRequest->name.' wants to sell: '.$this->sellRequest->item_title.'.',
            'sell_request_id' => $this->sellRequest->id,
            'url' => '/admin/sell-requests/'.$this->sellRequest->id,
        ];
    }
}