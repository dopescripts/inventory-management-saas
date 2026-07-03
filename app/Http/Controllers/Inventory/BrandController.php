<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\BrandRequest;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function index(): Response
    {
        $brands = Brand::query()
            ->where('tenant_id', Auth::guard('web')->user()->tenant_id)
            ->withCount('items')
            ->latest()
            ->paginate(10);

        return Inertia::render('inventory/brand/index', [
            'brands' => $brands,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('inventory/brand/create');
    }

    public function store(BrandRequest $request): RedirectResponse|JsonResponse
    {
        $brand = Brand::create([
            ...$request->validated(),
            'tenant_id' => $request->user()->tenant_id,
            'created_by' => $request->user()->id,
            'is_active' => $request->boolean('is_active', true),
        ]);

        if ($request->wantsJson()) {
            return response()->json(['id' => $brand->id, 'name' => $brand->name]);
        }

        return redirect()->route('brands.index')->with('success', 'Brand created successfully.');
    }

    public function show(string $id): never
    {
        abort(404);
    }

    public function edit(Brand $brand): Response
    {
        $this->ensureTenantOwnership($brand);

        return Inertia::render('inventory/brand/edit', [
            'brand' => $brand,
        ]);
    }

    public function update(BrandRequest $request, Brand $brand): RedirectResponse
    {
        $this->ensureTenantOwnership($brand);

        $brand->update([
            ...$request->validated(),
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()->route('brands.index')->with('success', 'Brand updated successfully.');
    }

    public function destroy(Brand $brand): RedirectResponse
    {
        $this->ensureTenantOwnership($brand);
        $brand->delete();

        return redirect()->route('brands.index')->with('success', 'Brand deleted successfully.');
    }

    private function ensureTenantOwnership(Brand $brand): void
    {
        abort_unless($brand->tenant_id === Auth::guard('web')->user()->tenant_id, 404);
    }
}
