<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\BrandRequest;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view_brands', only: ['index']),
            new Middleware('permission:create_brands', only: ['create', 'store']),
            new Middleware('permission:update_brands', only: ['edit', 'update']),
            new Middleware('permission:delete_brands', only: ['destroy']),
        ];
    }

    public function index(): Response
    {
        $brands = Brand::query()
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
        return Inertia::render('inventory/brand/edit', [
            'brand' => $brand,
        ]);
    }

    public function update(BrandRequest $request, Brand $brand): RedirectResponse
    {
        $brand->update([
            ...$request->validated(),
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()->route('brands.index')->with('success', 'Brand updated successfully.');
    }

    public function destroy(Brand $brand): RedirectResponse
    {
        $brand->delete();

        return redirect()->route('brands.index')->with('success', 'Brand deleted successfully.');
    }
}
