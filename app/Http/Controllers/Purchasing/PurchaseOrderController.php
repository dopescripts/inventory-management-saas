<?php

namespace App\Http\Controllers\Purchasing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Purchase\StorePurchaseRequest;
use App\Http\Requests\Purchase\UpdatePurchaseRequest;
use App\Models\Item;
use App\Models\PurchaseOrder;
use App\Models\Vendor;
use App\Models\Warehouse;
use App\Services\Purchasing\PurchaseService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseOrderController extends Controller
{
    public function index(): Response
    {
        $purchases = PurchaseOrder::query()
            ->with(['vendor', 'orderedBy'])
            ->withCount('items')
            ->latest()
            ->paginate();

        return Inertia::render('purchasing/index', [
            'purchaseOrders' => $purchases,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('purchasing/create', [
            'vendors' => Vendor::active()->select('id', 'name')->get(),
            'items' => Item::active()->select('id', 'name', 'sku')->get(),
        ]);
    }

    public function store(
        StorePurchaseRequest $request,
        PurchaseService $service
    ): RedirectResponse {
        $purchaseOrder = $service->store($request->validated());

        return redirect()
            ->route('purchases.show', $purchaseOrder)
            ->with('success', 'Purchase order created successfully.');
    }

    public function show(PurchaseOrder $purchaseOrder): Response
    {
        $purchaseOrder->load([
            'vendor',
            'orderedBy',
            'approvedBy',
            'items.item',
            'receives.receivedBy',
            'receives.items.item',
        ]);

        $warehouses = Warehouse::active()->with([
            'locations' => function ($query) {
                $query->active();
            },
        ])->get();

        return Inertia::render('purchasing/show', [
            'purchaseOrder' => $purchaseOrder,
            'warehouses' => $warehouses,
        ]);
    }

    public function edit(PurchaseOrder $purchaseOrder): Response
    {
        $purchaseOrder->load('items');

        return Inertia::render('purchasing/edit', [
            'purchaseOrder' => $purchaseOrder,
            'vendors' => Vendor::active()->select('id', 'name')->get(),
            'items' => Item::active()->select('id', 'name', 'sku')->get(),
        ]);
    }

    public function update(
        UpdatePurchaseRequest $request,
        PurchaseOrder $purchaseOrder,
        PurchaseService $service
    ): RedirectResponse {
        $service->update($purchaseOrder, $request->validated());

        return redirect()
            ->route('purchases.show', $purchaseOrder)
            ->with('success', 'Purchase order updated successfully.');
    }

    public function destroy(
        PurchaseOrder $purchaseOrder,
        PurchaseService $service
    ): RedirectResponse {
        $service->delete($purchaseOrder);

        return redirect()
            ->route('purchases.index')
            ->with('success', 'Purchase order deleted successfully.');
    }
}
