<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\UnitRequest;
use App\Models\Unit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class UnitController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view_units', only: ['index']),
            new Middleware('permission:create_units', only: ['create', 'store']),
            new Middleware('permission:update_units', only: ['edit', 'update']),
            new Middleware('permission:delete_units', only: ['destroy']),
        ];
    }

    public function index(): Response
    {
        $units = Unit::query()
            ->latest()
            ->paginate(10);

        return Inertia::render('inventory/unit/index', [
            'units' => $units,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('inventory/unit/create');
    }

    public function store(UnitRequest $request): RedirectResponse|JsonResponse
    {
        $unit = Unit::create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
            'is_active' => $request->boolean('is_active', true),
        ]);

        if ($request->wantsJson()) {
            return response()->json(['id' => $unit->id, 'name' => $unit->name, 'short_name' => $unit->short_name]);
        }

        return redirect()->route('units.index')->with('success', 'Unit created successfully.');
    }

    public function show(string $id): never
    {
        abort(404);
    }

    public function edit(Unit $unit): Response
    {
        return Inertia::render('inventory/unit/edit', [
            'unit' => $unit,
        ]);
    }

    public function update(UnitRequest $request, Unit $unit): RedirectResponse
    {
        $unit->update([
            ...$request->validated(),
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()->route('units.index')->with('success', 'Unit updated successfully.');
    }

    public function destroy(Unit $unit): RedirectResponse
    {
        $unit->delete();

        return redirect()->route('units.index')->with('success', 'Unit deleted successfully.');
    }
}
