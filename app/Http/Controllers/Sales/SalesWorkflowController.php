<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Models\SalesOrder;
use App\Services\Sales\SalesOrderService;
use Illuminate\Support\Facades\Auth;

class SalesWorkflowController extends Controller
{
    public function __construct(protected SalesOrderService $salesOrderService) {}

    public function confirm(SalesOrder $order)
    {
        if ($order->tenant_id !== Auth::user()->tenant_id) {
            abort(403);
        }

        $this->salesOrderService->confirmOrder($order);

        return back()->with('success', 'Sales Order confirmed successfully.');
    }

    public function ship(SalesOrder $order, \App\Services\Inventory\InventoryMovementService $inventoryService)
    {
        if ($order->tenant_id !== Auth::user()->tenant_id) {
            abort(403);
        }

        $this->salesOrderService->shipOrder($order, $inventoryService, Auth::id());

        return back()->with('success', 'Sales Order shipped successfully.');
    }

    public function complete(SalesOrder $order)
    {
        if ($order->tenant_id !== Auth::user()->tenant_id) {
            abort(403);
        }

        $this->salesOrderService->completeOrder($order);

        return back()->with('success', 'Sales Order completed successfully.');
    }

    public function cancel(SalesOrder $order)
    {
        if ($order->tenant_id !== Auth::user()->tenant_id) {
            abort(403);
        }

        $this->salesOrderService->cancelOrder($order);

        return back()->with('success', 'Sales Order cancelled successfully.');
    }
}
