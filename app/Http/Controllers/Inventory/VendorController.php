<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\StoreVendorRequest;
use App\Http\Requests\Vendor\UpdateVendorRequest;
use App\Models\Vendor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class VendorController extends Controller
{
    public function index(): Response
    {
        $vendors = Vendor::query()
            ->withCount('purchaseOrders')
            ->latest()
            ->paginate();

        return Inertia::render('inventory/vendors/index', [
            'vendors' => $vendors,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('inventory/vendors/create');
    }

    public function store(StoreVendorRequest $request): RedirectResponse|JsonResponse
    {
        $vendor = Vendor::create([
            ...$request->validated(),
            'created_by' => Auth::id(),
        ]);

        if ($request->wantsJson()) {
            return response()->json(['id' => $vendor->id, 'name' => $vendor->name]);
        }

        return redirect()
            ->route('vendors.index')
            ->with('success', 'Vendor created successfully.');
    }

    public function edit(Vendor $vendor): Response
    {
        return Inertia::render('inventory/vendors/edit', [
            'vendor' => $vendor,
        ]);
    }

    public function update(UpdateVendorRequest $request, Vendor $vendor): RedirectResponse
    {
        $vendor->update($request->validated());

        return redirect()
            ->route('vendors.index')
            ->with('success', 'Vendor updated successfully.');
    }

    public function destroy(Vendor $vendor): RedirectResponse
    {
        $vendor->delete();

        return redirect()
            ->route('vendors.index')
            ->with('success', 'Vendor deleted successfully.');
    }
}
