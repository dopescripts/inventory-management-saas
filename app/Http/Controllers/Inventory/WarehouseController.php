<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Warehouse\WarehouseRequest;
use App\Models\Warehouse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WarehouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $warehouses = Warehouse::query()
            ->with('createdBy:id,name,email')
            ->withCount('locations')
            ->where('tenant_id', Auth::guard('web')->user()->tenant_id)
            ->latest()
            ->paginate(5);

        return Inertia::render('inventory/warehouse/index', [
            'warehousesData' => $warehouses,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('inventory/warehouse/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(WarehouseRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['tenant_id'] = Auth::guard('web')->user()->tenant_id;
        $validated['created_by'] = Auth::guard('web')->id();
        $validated['is_active'] = $request->boolean('is_active', true);

        Warehouse::create($validated);

        return redirect()->route('warehouses.index')->with('success', 'Warehouse created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): Response
    {
        $warehouse = Warehouse::with(['locations', 'createdBy'])->where('tenant_id', Auth::guard('web')->user()->tenant_id)->where('id', $id)->firstOrFail();

        return Inertia::render('inventory/warehouse/show', [
            'warehouse' => $warehouse,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
