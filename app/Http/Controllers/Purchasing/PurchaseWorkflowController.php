<?php

namespace App\Http\Controllers\Purchasing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Purchase\ApprovePurchaseRequest;
use App\Http\Requests\Purchase\CancelPurchaseRequest;
use App\Http\Requests\Purchase\ClosePurchaseRequest;
use App\Http\Requests\Purchase\ReceivePurchaseRequest;
use App\Http\Requests\Purchase\SubmitPurchaseRequest;
use App\Models\PurchaseOrder;
use App\Services\Purchasing\PurchaseWorkflowService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class PurchaseWorkflowController extends Controller
{
    public function __construct(
        public PurchaseWorkflowService $workflowService
    ) {}

    public function submit(SubmitPurchaseRequest $request, PurchaseOrder $purchaseOrder): RedirectResponse
    {
        Gate::authorize('submit', $purchaseOrder);

        $this->workflowService->submit($purchaseOrder);

        return redirect()->back()->with('success', 'Purchase order submitted successfully.');
    }

    public function approve(ApprovePurchaseRequest $request, PurchaseOrder $purchaseOrder): RedirectResponse
    {
        Gate::authorize('approve', $purchaseOrder);

        $this->workflowService->approve($purchaseOrder);

        return redirect()->back()->with('success', 'Purchase order approved successfully.');
    }

    public function cancel(CancelPurchaseRequest $request, PurchaseOrder $purchaseOrder): RedirectResponse
    {
        Gate::authorize('cancel', $purchaseOrder);

        $this->workflowService->cancel($purchaseOrder);

        return redirect()->back()->with('success', 'Purchase order cancelled successfully.');
    }

    public function close(ClosePurchaseRequest $request, PurchaseOrder $purchaseOrder): RedirectResponse
    {
        Gate::authorize('close', $purchaseOrder);

        $this->workflowService->close($purchaseOrder);

        return redirect()->back()->with('success', 'Purchase order closed successfully.');
    }

    public function receive(ReceivePurchaseRequest $request, PurchaseOrder $purchaseOrder): RedirectResponse
    {
        Gate::authorize('receive', $purchaseOrder);

        $this->workflowService->receive($purchaseOrder, $request->validated());

        return redirect()->back()->with('success', 'Goods received successfully.');
    }
}
