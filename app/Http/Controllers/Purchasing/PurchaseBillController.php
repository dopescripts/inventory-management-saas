<?php

namespace App\Http\Controllers\Purchasing;

use App\Http\Controllers\Controller;
use App\Models\PurchaseBill;
use App\Models\PurchaseOrder;
use App\Services\Purchasing\BillService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class PurchaseBillController extends Controller
{
    public function index(): Response
    {
        $bills = PurchaseBill::query()
            ->with(['purchaseOrder.vendor', 'currency', 'createdBy'])
            ->latest()
            ->paginate();

        return Inertia::render('purchasing/bills/index', [
            'bills' => $bills,
        ]);
    }

    public function show(PurchaseBill $bill): Response
    {
        $bill->load([
            'purchaseOrder.vendor',
            'purchaseReceive.warehouse',
            'currency',
            'items.item',
            'createdBy',
        ]);

        return Inertia::render('purchasing/bills/show', [
            'bill' => $bill,
        ]);
    }

    public function createFromPurchaseOrder(PurchaseOrder $purchaseOrder, BillService $billService): RedirectResponse
    {
        Gate::authorize('create', PurchaseBill::class);

        $bill = $billService->generateFromPurchaseOrder($purchaseOrder);

        return redirect()
            ->route('bills.show', $bill)
            ->with('success', 'Bill generated successfully.');
    }

    public function destroy(PurchaseBill $bill): RedirectResponse
    {
        Gate::authorize('delete', $bill);

        if ($bill->status->value !== 'draft') {
            return back()->with('error', 'Only draft bills can be deleted.');
        }

        $bill->items()->delete();
        $bill->delete();

        return redirect()
            ->route('bills.index')
            ->with('success', 'Bill deleted successfully.');
    }

    public function markAsPaid(PurchaseBill $bill, BillService $billService): RedirectResponse
    {
        Gate::authorize('update', $bill);

        $billService->markAsPaid($bill);

        return back()->with('success', 'Bill marked as paid.');
    }

    public function cancel(PurchaseBill $bill, BillService $billService): RedirectResponse
    {
        Gate::authorize('update', $bill);

        $billService->cancel($bill);

        return back()->with('success', 'Bill cancelled.');
    }

    public function download(PurchaseBill $bill): HttpResponse
    {
        Gate::authorize('view', $bill);

        $bill->load([
            'purchaseOrder.vendor',
            'currency',
            'items.item',
            'createdBy',
        ]);

        $tenant = $bill->tenant;
        $tenant->load('currency');

        $pdf = Pdf::loadView('pdf.purchase-bill', [
            'bill' => $bill,
            'tenant' => $tenant,
            'vendor' => $bill->purchaseOrder->vendor,
            'currency' => $bill->currency ?? $tenant->currency,
        ]);

        return $pdf->download("bill-{$bill->bill_number}.pdf");
    }
}
