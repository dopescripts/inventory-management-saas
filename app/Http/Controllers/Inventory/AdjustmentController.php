<?php

namespace App\Http\Controllers\Inventory;

use App\Enums\InventoryMovementDirection;
use App\Enums\InventoryMovementReferenceType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\AdjustmentRequest;
use App\Models\InventoryMovement;
use App\Models\Item;
use App\Models\Warehouse;
use App\Services\Inventory\InventoryMovementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class AdjustmentController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view_adjustments', only: ['index']),
            new Middleware('permission:create_adjustments', only: ['create', 'store']),
        ];
    }

    public function index(): Response
    {
        $adjustments = InventoryMovement::query()
            ->with(['item:id,name,sku', 'warehouse:id,name', 'location:id,code', 'performedBy:id,name'])
            ->where('reference_type', InventoryMovementReferenceType::Adjustment)
            ->latest()
            ->paginate(10);

        return Inertia::render('inventory/adjustment/index', [
            'adjustments' => $adjustments,
        ]);
    }

    public function create(): Response
    {
        $items = Item::query()->orderBy('name')->get(['id', 'name', 'sku']);
        $warehouses = Warehouse::query()->with('locations:id,warehouse_id,code')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('inventory/adjustment/create', [
            'items' => $items,
            'warehouses' => $warehouses,
            'directions' => [
                ['value' => InventoryMovementDirection::In->value, 'label' => 'Increase Stock'],
                ['value' => InventoryMovementDirection::Out->value, 'label' => 'Decrease Stock'],
            ],
        ]);
    }

    public function store(AdjustmentRequest $request, InventoryMovementService $inventoryService): RedirectResponse
    {
        // We will store reason in notes, or combine reason + notes if both exist
        $reason = $request->validated('reason');
        $notes = $request->validated('notes');
        $combinedNotes = collect([$reason, $notes])->filter()->join(' - ');

        $inventoryService->adjustStock(
            itemId: $request->validated('item_id'),
            warehouseId: $request->validated('warehouse_id'),
            locationId: $request->validated('location_id'),
            direction: InventoryMovementDirection::from($request->validated('direction')),
            quantity: $request->validated('quantity'),
            notes: $combinedNotes ?: null,
            performedBy: $request->user()->id,
        );

        return redirect()->route('adjustments.index')->with('success', 'Stock adjustment recorded successfully.');
    }
}
