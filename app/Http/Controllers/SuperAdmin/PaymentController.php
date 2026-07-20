<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Payment::with('tenant')->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        return Inertia::render('super-admin/payments/index', [
            'payments' => $query->paginate(15)->withQueryString(),
            'filters' => [
                'status' => $request->input('status', ''),
            ],
        ]);
    }
}
