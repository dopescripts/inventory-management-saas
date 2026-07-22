<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class BillInvoiceReminder extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public int $billId,
        public string $billReference,
        public float $amountDue,
        public string $vendorName
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
        return [
            'bill_id' => $this->billId,
            'bill_reference' => $this->billReference,
            'amount_due' => $this->amountDue,
            'vendor_name' => $this->vendorName,
            'message' => "Pending Bill: {$this->billReference} for {$this->vendorName} is unpaid. Amount due: {$this->amountDue}.",
            'type' => 'bill_reminder',
        ];
    }
}
