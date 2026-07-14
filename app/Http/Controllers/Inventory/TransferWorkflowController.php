<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transfer\ApproveTransferRequest;
use App\Http\Requests\Transfer\CancelTransferRequest;
use App\Http\Requests\Transfer\ReceiveTransferRequest;
use App\Http\Requests\Transfer\ShipTransferRequest;
use App\Http\Requests\Transfer\SubmitTransferRequest;
use App\Models\Transfers;
use App\Services\Inventory\TransferWorkflowService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class TransferWorkflowController extends Controller
{
    public function __construct(
        public TransferWorkflowService $workflowService
    ) {}

    public function submit(SubmitTransferRequest $request, Transfers $transfer): RedirectResponse
    {
        Gate::authorize('submit', $transfer);

        $this->workflowService->submit($transfer);

        return redirect()->back()->with('success', 'Transfer submitted successfully.');
    }

    public function approve(ApproveTransferRequest $request, Transfers $transfer): RedirectResponse
    {
        Gate::authorize('approve', $transfer);

        $this->workflowService->approve($transfer);

        return redirect()->back()->with('success', 'Transfer approved successfully.');
    }

    public function cancel(CancelTransferRequest $request, Transfers $transfer): RedirectResponse
    {
        Gate::authorize('cancel', $transfer);

        $this->workflowService->cancel($transfer);

        return redirect()->back()->with('success', 'Transfer cancelled successfully.');
    }

    public function ship(ShipTransferRequest $request, Transfers $transfer): RedirectResponse
    {
        Gate::authorize('ship', $transfer);

        $this->workflowService->ship($transfer, $request->validated('items'));

        return redirect()->back()->with('success', 'Transfer shipped successfully.');
    }

    public function receive(ReceiveTransferRequest $request, Transfers $transfer): RedirectResponse
    {
        Gate::authorize('receive', $transfer);

        $this->workflowService->receive($transfer, $request->validated('items'));

        return redirect()->back()->with('success', 'Transfer received successfully.');
    }
}
