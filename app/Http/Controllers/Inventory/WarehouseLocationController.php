<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\WarehouseLocationRequest;
use App\Models\Location;
use App\Models\Warehouse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WarehouseLocationController extends Controller
{
    /**
     * Show the form for creating a new location.
     */
    public function create(string $warehouseId): Response
    {
        $warehouse = Warehouse::findOrFail($warehouseId);

        return Inertia::render('inventory/warehouse/location/create', [
            'warehouse' => $warehouse,
        ]);
    }

    /**
     * Store a newly created location in storage.
     */
    public function store(WarehouseLocationRequest $request, string $warehouseId): RedirectResponse
    {
        $warehouse = Warehouse::findOrFail($warehouseId);
        $validated = $request->validated();

        $validated['warehouse_id'] = $warehouse->id;
        $validated['tenant_id'] = Auth::guard('web')->user()->tenant_id;
        $validated['created_by'] = Auth::guard('web')->id();

        Location::create($validated);

        return redirect()->route('warehouses.show', ['warehouse' => $warehouse->id, 'tab' => 'locations'])
            ->with('success', 'Location created successfully.');
    }
}
