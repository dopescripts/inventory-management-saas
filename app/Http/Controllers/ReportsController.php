<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\PurchaseBill;
use App\Models\PurchaseOrder;
use App\Models\SalesOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ReportsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('reports/index');
    }

    public function inventory(Request $request): Response
    {
        $tenantId = Auth::guard('web')->user()->tenant_id;

        $items = Item::where('tenant_id', $tenantId)
            ->withCount('inventoryMovements')
            ->paginate(50);

        return Inertia::render('reports/inventory', [
            'items' => $items,
        ]);
    }

    public function financial(Request $request): Response
    {
        $tenantId = Auth::guard('web')->user()->tenant_id;

        $bills = PurchaseBill::where('tenant_id', $tenantId)
            ->latest('issued_at')
            ->paginate(50);

        return Inertia::render('reports/financial', [
            'bills' => $bills,
        ]);
    }

    public function sales(Request $request): Response
    {
        $tenantId = Auth::guard('web')->user()->tenant_id;

        $orders = SalesOrder::where('tenant_id', $tenantId)
            ->with(['customer', 'items'])
            ->latest('order_date')
            ->paginate(50);

        return Inertia::render('reports/sales', [
            'orders' => $orders,
        ]);
    }

    public function purchases(Request $request): Response
    {
        $tenantId = Auth::guard('web')->user()->tenant_id;

        $orders = PurchaseOrder::where('tenant_id', $tenantId)
            ->with(['vendor', 'items'])
            ->latest('created_at')
            ->paginate(50);

        return Inertia::render('reports/purchases', [
            'orders' => $orders,
        ]);
    }

    public function exportInventory()
    {
        $tenantId = Auth::guard('web')->user()->tenant_id;
        $items = Item::where('tenant_id', $tenantId)->get();

        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=inventory_report.csv',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($items) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['SKU', 'Name', 'Track Inventory', 'Status']);

            foreach ($items as $item) {
                fputcsv($file, [
                    $item->sku,
                    $item->name,
                    $item->track_inventory ? 'Yes' : 'No',
                    $item->is_active ? 'Active' : 'Inactive',
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportFinancial()
    {
        $tenantId = Auth::guard('web')->user()->tenant_id;
        $bills = PurchaseBill::where('tenant_id', $tenantId)->get();

        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=financial_report.csv',
        ];

        $callback = function () use ($bills) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Bill Number', 'Total', 'Paid Amount', 'Status', 'Due Date']);

            foreach ($bills as $bill) {
                fputcsv($file, [
                    $bill->bill_number,
                    $bill->total,
                    $bill->paid_amount,
                    $bill->status->value ?? $bill->status,
                    $bill->due_date ? $bill->due_date->format('Y-m-d') : 'N/A',
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportSales()
    {
        $tenantId = Auth::guard('web')->user()->tenant_id;
        $orders = SalesOrder::where('tenant_id', $tenantId)->with('customer')->get();

        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=sales_report.csv',
        ];

        $callback = function () use ($orders) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Order Number', 'Customer', 'Total', 'Status', 'Order Date']);

            foreach ($orders as $order) {
                fputcsv($file, [
                    $order->number,
                    $order->customer ? $order->customer->name : 'N/A',
                    $order->total,
                    $order->status,
                    $order->order_date ? $order->order_date->format('Y-m-d') : 'N/A',
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportPurchases()
    {
        $tenantId = Auth::guard('web')->user()->tenant_id;
        $orders = PurchaseOrder::where('tenant_id', $tenantId)->with('vendor')->get();

        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=purchases_report.csv',
        ];

        $callback = function () use ($orders) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['PO Number', 'Vendor', 'Total', 'Status', 'Expected Date']);

            foreach ($orders as $order) {
                fputcsv($file, [
                    $order->purchase_number,
                    $order->vendor ? $order->vendor->name : 'N/A',
                    $order->total,
                    $order->status,
                    $order->expected_date ? $order->expected_date->format('Y-m-d') : 'N/A',
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
