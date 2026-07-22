<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $customers = Customer::query()
            ->where('tenant_id', Auth::user()->tenant_id)
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('sales/customers/index', [
            'customers' => $customers,
        ]);
    }

    public function create()
    {
        return Inertia::render('sales/customers/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'tax_number' => 'nullable|string|max:255',
            'billing_address' => 'nullable|string',
            'shipping_address' => 'nullable|string',
            'credit_limit' => 'nullable|numeric|min:0',
            'payment_terms' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:active,inactive',
            'notes' => 'nullable|string',
        ]);

        $validated['tenant_id'] = Auth::user()->tenant_id;

        $customer = Customer::create($validated);

        return redirect()->route('customers.index')->with('success', 'Customer created successfully.');
    }

    public function show(Customer $customer)
    {
        if ($customer->tenant_id !== Auth::user()->tenant_id) {
            abort(403);
        }

        return Inertia::render('sales/customers/show', [
            'customer' => $customer,
        ]);
    }

    public function edit(Customer $customer)
    {
        if ($customer->tenant_id !== Auth::user()->tenant_id) {
            abort(403);
        }

        return Inertia::render('sales/customers/edit', [
            'customer' => $customer,
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        if ($customer->tenant_id !== Auth::user()->tenant_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'tax_number' => 'nullable|string|max:255',
            'billing_address' => 'nullable|string',
            'shipping_address' => 'nullable|string',
            'credit_limit' => 'nullable|numeric|min:0',
            'payment_terms' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:active,inactive',
            'notes' => 'nullable|string',
        ]);

        $customer->update($validated);

        return redirect()->route('customers.index')->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        if ($customer->tenant_id !== Auth::user()->tenant_id) {
            abort(403);
        }

        $customer->delete();

        return redirect()->route('customers.index')->with('success', 'Customer deleted successfully.');
    }
}
