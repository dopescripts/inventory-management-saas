<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\ItemRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Item;
use App\Models\Unit;
use App\Services\PlanGate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ItemController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view_items', only: ['index']),
            new Middleware('permission:create_items', only: ['create', 'store']),
            new Middleware('permission:update_items', only: ['edit', 'update']),
            new Middleware('permission:delete_items', only: ['destroy']),
        ];
    }

    public function index(): Response
    {
        $items = Item::query()
            ->with(['category:id,name', 'brand:id,name', 'unit:id,name,short_name'])
            ->latest()
            ->paginate(10);

        return Inertia::render('inventory/item/index', [
            'items' => $items,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('inventory/item/create', [
            'categories' => $this->categories(),
            'brands' => $this->brands(),
            'units' => $this->units(),
        ]);
    }

    public function store(ItemRequest $request, PlanGate $gate): RedirectResponse
    {

        if ($gate->canCreateProduct(Auth::guard('web')->user()->tenant)) {
            Item::create([
                ...$request->validated(),
                'created_by' => $request->user()->id,
                'track_inventory' => $request->boolean('track_inventory', true),
                'low_stock_threshold' => $request->integer('low_stock_threshold', 0),
                'is_active' => $request->boolean('is_active', true),
            ]);

            return redirect()->route('items.index')->with('success', 'Item created successfully.');
        }

        return redirect()->route('items.index')->with('error', 'You have reached the maximum number of items allowed in your current plan');
    }

    public function show(string $id): never
    {
        abort(404);
    }

    public function edit(Item $item): Response
    {
        return Inertia::render('inventory/item/edit', [
            'item' => $item->load(['category', 'brand', 'unit']),
            'categories' => $this->categories(),
            'brands' => $this->brands(),
            'units' => $this->units(),
        ]);
    }

    public function update(ItemRequest $request, Item $item): RedirectResponse
    {
        $item->update([
            ...$request->validated(),
            'track_inventory' => $request->boolean('track_inventory', true),
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()->route('items.index')->with('success', 'Item updated successfully.');
    }

    public function destroy(Item $item): RedirectResponse
    {
        $item->delete();

        return redirect()->route('items.index')->with('success', 'Item deleted successfully.');
    }

    /**
     * @return array<int, array{id: int, name: string}>
     */
    private function categories(): array
    {
        return Category::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Category $category): array => ['id' => $category->id, 'name' => $category->name])
            ->all();
    }

    /**
     * @return array<int, array{id: int, name: string}>
     */
    private function brands(): array
    {
        return Brand::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Brand $brand): array => ['id' => $brand->id, 'name' => $brand->name])
            ->all();
    }

    /**
     * @return array<int, array{id: int, name: string, short_name: string}>
     */
    private function units(): array
    {
        return Unit::query()
            ->orderBy('name')
            ->get(['id', 'name', 'short_name'])
            ->map(fn (Unit $unit): array => ['id' => $unit->id, 'name' => $unit->name, 'short_name' => $unit->short_name])
            ->all();
    }
}
