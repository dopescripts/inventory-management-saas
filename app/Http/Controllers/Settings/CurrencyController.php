<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class CurrencyController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/currency', [
            'currencies' => Currency::active()->select('id', 'code', 'name', 'symbol')->get(),
            'currentCurrencyId' => $request->user()->tenant?->default_currency_id,
            'billingAddress' => $request->user()->tenant?->billing_address,
            'billingPhone' => $request->user()->tenant?->billing_phone,
            'billingEmail' => $request->user()->tenant?->billing_email,
            'taxId' => $request->user()->tenant?->tax_id,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (!$user->hasAnyRole(['owner', 'manager'])) {
            abort(403);
        }

        $validated = $request->validate([
            'default_currency_id' => ['required', 'exists:currencies,id'],
            'billing_address' => ['nullable', 'string', 'max:500'],
            'billing_phone' => ['nullable', 'string', 'max:50'],
            'billing_email' => ['nullable', 'email', 'max:255'],
            'tax_id' => ['nullable', 'string', 'max:100'],
        ]);

        $user->tenant?->update($validated);

        // @phpstan-ignore property.notFound
        Cache::forget("tenant:{$user->tenant_id}:auth_payload");

        return redirect()
            ->route('currency.edit')
            ->with('success', 'Currency & billing settings updated.');
    }
}
