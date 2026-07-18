<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Item;
use App\Models\SalesOrder;
use App\Models\Warehouse;
use App\Services\Sales\SalesOrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SalesOrderController extends Controller
{
    public function __construct(protected SalesOrderService $salesOrderService) {}

    public function index(Request $request)
    {
        $salesOrders = SalesOrder::query()
            ->with(['customer', 'warehouse'])
            ->where('tenant_id', Auth::user()->tenant_id)
            ->when($request->search, function ($query, $search) {
                $query->where('number', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('sales/orders/index', [
            'salesOrders' => $salesOrders,
        ]);
    }

    public function create()
    {
        $customers = Customer::where('tenant_id', Auth::user()->tenant_id)
            ->where('status', 'active')
            ->get();

        $warehouses = Warehouse::where('tenant_id', Auth::user()->tenant_id)
            ->where('is_active', true)
            ->get();

        $items = Item::where('tenant_id', Auth::user()->tenant_id)
            ->where('is_active', true)
            ->get();

        return Inertia::render('sales/orders/create', [
            'customers' => $customers,
            'warehouses' => $warehouses,
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'order_date' => 'required|date',
            'expected_ship_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.ordered_quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $this->salesOrderService->createOrder(
            Auth::user()->tenant_id,
            $validated['customer_id'],
            $validated['warehouse_id'],
            $validated['order_date'],
            $validated['expected_ship_date'] ?? null,
            $validated['items'],
            $validated['notes'] ?? null
        );

        return redirect()->route('orders.index')->with('success', 'Sales Order created successfully.');
    }

    public function show(SalesOrder $order)
    {
        if ($order->tenant_id !== Auth::user()->tenant_id) {
            abort(403);
        }

        $order->load(['customer', 'warehouse', 'items.item']);

        return Inertia::render('sales/orders/show', [
            'salesOrder' => $order,
        ]);
    }

    public function edit(SalesOrder $order)
    {
        if ($order->tenant_id !== Auth::user()->tenant_id) {
            abort(403);
        }

        if ($order->status !== 'draft') {
            return redirect()->route('orders.show', $order)->with('error', 'Only draft orders can be edited.');
        }

        $order->load('items');

        $customers = Customer::where('tenant_id', Auth::user()->tenant_id)->where('status', 'active')->get();
        $warehouses = Warehouse::where('tenant_id', Auth::user()->tenant_id)->where('is_active', true)->get();
        $items = Item::where('tenant_id', Auth::user()->tenant_id)->where('is_active', true)->get();

        return Inertia::render('sales/orders/edit', [
            'salesOrder' => $order,
            'customers' => $customers,
            'warehouses' => $warehouses,
            'items' => $items,
        ]);
    }

    public function update(Request $request, SalesOrder $order)
    {
        if ($order->tenant_id !== Auth::user()->tenant_id) {
            abort(403);
        }

        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'order_date' => 'required|date',
            'expected_ship_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.ordered_quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $this->salesOrderService->updateOrder($order, $validated);

        return redirect()->route('orders.index')->with('success', 'Sales Order updated successfully.');
    }

    public function destroy(SalesOrder $order)
    {
        if ($order->tenant_id !== Auth::user()->tenant_id) {
            abort(403);
        }

        if ($order->status !== 'draft') {
            return back()->with('error', 'Only draft orders can be deleted.');
        }

        $order->delete();

        return redirect()->route('orders.index')->with('success', 'Sales Order deleted successfully.');
    }
}
