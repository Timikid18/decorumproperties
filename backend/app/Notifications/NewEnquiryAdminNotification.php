<?php

namespace App\Notifications;

use App\Models\Enquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewEnquiryAdminNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Enquiry $enquiry,
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
            'type' => 'new_enquiry',
            'title' => 'New enquiry received',
            'body' => $this->enquiry->name.' enquired about '.($this->enquiry->listing?->title ?? 'a listing').'.',
            'enquiry_id' => $this->enquiry->id,
            'url' => '/admin/enquiries/'.$this->enquiry->id,
        ];
    }
}