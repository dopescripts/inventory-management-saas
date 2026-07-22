<?php

namespace App\Http\Controllers;

use App\Enums\BillStatus;
use App\Models\InventoryMovement;
use App\Models\Item;
use App\Models\PurchaseBill;
use App\Models\SalesOrder;
use App\Models\Warehouse;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $tenantId = Auth::guard('web')->user()->tenant_id;

        $totalItems = Item::where('tenant_id', $tenantId)->where('is_active', true)->count();
        $totalWarehouses = Warehouse::where('tenant_id', $tenantId)->where('is_active', true)->count();

        $revenue = SalesOrder::where('tenant_id', $tenantId)
            ->whereNotIn('status', ['cancelled', 'draft'])
            ->sum('total');

        $expenses = PurchaseBill::where('tenant_id', $tenantId)
            ->whereNotIn('status', [BillStatus::Cancelled, BillStatus::Draft])
            ->sum('total');

        // Inventory trend over the last 30 days
        $thirtyDaysAgo = Carbon::now()->subDays(30);
        $movements = InventoryMovement::where('tenant_id', $tenantId)
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(quantity) as net_quantity')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Fill in missing days with 0 so the chart looks continuous
        $trend = [];
        $runningDate = $thirtyDaysAgo->copy();
        $now = Carbon::now();

        while ($runningDate <= $now) {
            $dateString = $runningDate->format('Y-m-d');
            $movementForDate = $movements->firstWhere('date', $dateString);

            $trend[] = [
                'date' => $runningDate->format('M d'),
                'quantity' => $movementForDate ? (float) $movementForDate->net_quantity : 0,
            ];
            $runningDate->addDay();
        }

        return Inertia::render('dashboard', [
            'totalItems' => $totalItems,
            'totalWarehouses' => $totalWarehouses,
            'profitAndLoss' => [
                'revenue' => (float) $revenue,
                'expenses' => (float) $expenses,
                'net' => (float) ($revenue - $expenses),
            ],
            'inventoryTrend' => $trend,
        ]);
    }
}
