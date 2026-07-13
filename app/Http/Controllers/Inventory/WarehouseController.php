<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Warehouse\WarehouseRequest;
use App\Models\InventoryMovement;
use App\Models\Warehouse;
use App\Services\PlanGate;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WarehouseController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view_warehouses', only: ['index']),
            new Middleware('permission:create_warehouses', only: ['create', 'store']),
            new Middleware('permission:update_warehouses', only: ['edit', 'update']),
            new Middleware('permission:delete_warehouses', only: ['destroy']),
        ];
    }

    public function index(): Response
    {
        $warehouses = Warehouse::query()
            ->with('createdBy:id,name,email')
            ->withCount('locations')
            ->latest()
            ->paginate(5);

        return Inertia::render('inventory/warehouse/index', [
            'warehousesData' => $warehouses,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('inventory/warehouse/create');
    }

    public function store(WarehouseRequest $request, PlanGate $gate): RedirectResponse
    {
        $validated = $request->validated();
        if ($gate->canCreateWarehouse(Auth::guard('web')->user()->tenant)) {
            $validated['created_by'] = $request->user()->id;
            $validated['is_active'] = $request->boolean('is_active', true);

            Warehouse::create($validated);

            return redirect()->route('warehouses.index')->with('success', 'Warehouse created successfully.');
        }

        return redirect()->route('warehouses.index')->with('error', 'You have reached the maximum number of warehouses.');
    }

    public function show(Warehouse $warehouse): Response
    {
        $warehouse->load(['locations', 'createdBy:id,name,email'])->loadCount('locations');

        $inventory = $this->warehouseInventory($warehouse);

        $recentMovements = $warehouse->inventoryMovements()
            ->with([
                'item:id,name,sku',
                'location:id,code',
                'performedBy:id,name',
            ])
            ->latest()
            ->take(20)
            ->get();

        return Inertia::render('inventory/warehouse/show', [
            'warehouse' => $warehouse,
            'inventory' => $inventory,
            'recentMovements' => $recentMovements,
        ]);
    }

    public function edit(string $id): void
    {
        //
    }

    public function update(Request $request, string $id): void
    {
        //
    }

    public function destroy(string $id): void
    {
        //
    }

    /**
     * Current stock levels per item+location for a warehouse.
     *
     * @return Collection<int, InventoryMovement>
     */
    private function warehouseInventory(Warehouse $warehouse): Collection
    {
        return $warehouse->inventoryMovements()
            ->selectRaw('
                item_id,
                location_id,
                SUM(CASE WHEN direction = ? THEN quantity ELSE quantity * -1 END) as balance
            ', ['in'])
            ->groupBy('item_id', 'location_id')
            ->having('balance', '>', 0)
            ->with(['item:id,name,sku', 'location:id,code'])
            ->get();
    }
}
