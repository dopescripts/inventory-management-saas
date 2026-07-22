<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transfer\StoreTransferRequest;
use App\Http\Requests\Transfer\UpdateTransferRequest;
use App\Models\Item;
use App\Models\Location;
use App\Models\Transfers;
use App\Models\Warehouse;
use App\Services\Inventory\TransferService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TransferController extends Controller
{
    public function index(): Response
    {
        $transfers = Transfers::query()
            ->with([
                'sourceWarehouse',
                'destinationWarehouse',
                'requestedBy',
            ])
            ->withCount('items')
            ->latest()
            ->paginate();

        return Inertia::render('inventory/transfers/index', [
            'transfers' => $transfers,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('inventory/transfers/create', [
            'warehouses' => Warehouse::active()->with([
                'locations' => function ($query) {
                    $query->active();
                },
            ])->get(),
            'items' => Item::active()
                ->select('id', 'name', 'sku')
                ->get(),
        ]);
    }

    public function store(
        StoreTransferRequest $request,
        TransferService $service
    ): RedirectResponse {

        $transfer = $service->store($request->validated());

        return redirect()
            ->route('transfers.show', $transfer)
            ->with('success', 'Transfer created successfully.');
    }

    public function show(Transfers $transfer): Response
    {
        $transfer->load([
            'sourceWarehouse',
            'destinationWarehouse',
            'sourceLocation',
            'destinationLocation',
            'requestedBy',
            'approvedBy',
            'receivedBy',
            'items.item',
        ]);

        return Inertia::render('inventory/transfers/show', [
            'transfer' => $transfer,
        ]);
    }

    public function edit(Transfers $transfer): Response
    {
        $transfer->load('items');

        return Inertia::render('inventory/transfers/edit', [
            'transfer' => $transfer,
            'warehouses' => Warehouse::active()->get(),
            'locations' => Location::active()->get(),
            'items' => Item::active()->get(),
        ]);
    }

    public function update(
        UpdateTransferRequest $request,
        Transfers $transfer,
        TransferService $service
    ): RedirectResponse {

        $service->update($transfer, $request->validated());

        return redirect()
            ->route('transfers.show', $transfer)
            ->with('success', 'Transfer updated successfully.');
    }

    public function destroy(
        Transfers $transfer,
        TransferService $service
    ): RedirectResponse {

        $service->delete($transfer);

        return redirect()
            ->route('transfers.index')
            ->with('success', 'Transfer deleted successfully.');
    }
}
