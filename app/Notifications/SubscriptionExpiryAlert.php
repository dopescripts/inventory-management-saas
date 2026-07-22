<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class SubscriptionExpiryAlert extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public int $daysUntilExpiry,
        public bool $isPastDue
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $message = $this->isPastDue 
            ? "Your subscription is past due. Please renew immediately to avoid service interruption."
            : "Your subscription expires in {$this->daysUntilExpiry} days. Please renew soon.";

        return [
            'days_until_expiry' => $this->daysUntilExpiry,
            'is_past_due' => $this->isPastDue,
            'message' => $message,
            'type' => 'subscription_expiry',
        ];
    }
}
