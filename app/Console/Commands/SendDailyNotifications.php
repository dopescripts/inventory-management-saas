<?php

namespace App\Console\Commands;

use App\Enums\BillStatus;
use App\Models\PurchaseBill;
use App\Models\Subscription;
use App\Models\User;
use App\Notifications\BillInvoiceReminder;
use App\Notifications\SubscriptionExpiryAlert;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class SendDailyNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:send-daily';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send daily notifications for low stock, subscriptions, and bills.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->notifyExpiringSubscriptions();
        $this->notifyPendingBills();

        $this->info('Daily notifications sent.');
    }

    private function notifyExpiringSubscriptions()
    {
        // Find subscriptions expiring in <= 3 days, or already expired but within last 14 days (grace period)
        $subscriptions = Subscription::whereIn('status', ['active', 'trial', 'past_due'])
            ->where('expires_at', '<=', Carbon::now()->addDays(3))
            ->where('expires_at', '>=', Carbon::now()->subDays(14))
            ->get();

        foreach ($subscriptions as $subscription) {
            $daysUntilExpiry = (int) Carbon::now()->startOfDay()->diffInDays(Carbon::parse($subscription->expires_at)->startOfDay(), false);
            $isPastDue = $daysUntilExpiry < 0;

            // Notify all active users in tenant
            $users = User::where('tenant_id', $subscription->tenant_id)->get();

            if ($users->isNotEmpty()) {
                Notification::send($users, new SubscriptionExpiryAlert(max(0, $daysUntilExpiry), $isPastDue));
            }
        }
    }

    private function notifyPendingBills()
    {
        // Find bills that are pending, partially_paid, or overdue
        $bills = PurchaseBill::with(['tenant', 'purchaseOrder.vendor'])
            ->whereIn('status', [BillStatus::Pending->value, BillStatus::PartiallyPaid->value, BillStatus::Overdue->value])
            ->get();

        foreach ($bills as $bill) {
            $amountDue = (float) $bill->total - (float) $bill->paid_amount;

            if ($amountDue <= 0) {
                continue;
            }

            $vendorName = $bill->purchaseOrder?->vendor?->name ?? 'Unknown Vendor';
            $users = User::where('tenant_id', $bill->tenant_id)->get();

            if ($users->isNotEmpty()) {
                Notification::send($users, new BillInvoiceReminder(
                    $bill->id,
                    $bill->bill_number ?? 'N/A',
                    $amountDue,
                    $vendorName
                ));
            }
        }
    }
}
