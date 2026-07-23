<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'companyName' => $request->user()->tenant?->name,
            'companyLogo' => $request->user()->tenant?->logo,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $request->user()->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        if ($request->has('company_name') && $request->user()->hasRole('owner')) {
            $request->user()->tenant?->update([
                'name' => $validated['company_name'],
            ]);
        }

        if ($request->hasFile('company_logo') && $request->user()->hasRole('owner')) {
            $currentLogo = $request->user()->tenant->logo;

            if ($currentLogo && Storage::disk('public')->exists($currentLogo)) {
                Storage::disk('public')->delete($currentLogo);
            }

            $request->user()->tenant?->update([
                'logo' => Storage::disk('public')->putFileAs('tenants/logos', $request->file('company_logo'), $request->user()->tenant->id . '.' . $request->file('company_logo')->getClientOriginalExtension()),
            ]);
        }

        // @phpstan-ignore method.notFound
        if ($request->user()->hasRole('owner')) {

            // @phpstan-ignore property.notFound
            Cache::forget("tenant:{$request->user()->tenant_id}:auth_payload");

        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Profile updated.')]);

        return to_route('profile.edit');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
