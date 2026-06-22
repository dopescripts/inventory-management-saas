<?php

namespace App\Http\Controllers;

use App\Http\Requests\StaffRequest;
use App\Mail\StaffInvitationMail;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function index()
    {
        $staff = User::where('tenant_id', auth()->user()->tenant_id)
            ->with('roles')
            ->get();

        return Inertia::render('staff/index', [
            'staff' => $staff,
        ]);
    }

    public function create()
    {
        return Inertia::render('staff/create');
    }

    public function store(StaffRequest $request)
    {
        $password = Str::random(12);

        $staff = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($password),
            'tenant_id' => $request->user()->tenant_id,
        ]);

        $staff->assignRole($request->role);

        Mail::to($staff->email)->send(new StaffInvitationMail($password, route('login')));

        return redirect()->route('staff.index')->with('success', 'Staff member created and invited.');
    }

    public function edit(User $staff)
    {
        if ($staff->tenant_id !== auth()->user()->tenant_id) {
            abort(404);
        }

        $staff->load('roles');

        return Inertia::render('staff/edit', [
            'staff' => $staff,
        ]);
    }

    public function update(StaffRequest $request, User $staff)
    {
        if ($staff->tenant_id !== $request->user()->tenant_id) {
            abort(404);
        }

        if ($staff->id === $request->user()->id) {
            return back()->with('error', 'You cannot modify yourself here.');
        }

        if ($staff->hasRole('owner')) {
            return back()->with('error', 'You cannot modify an owner.');
        }

        $staff->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        $staff->syncRoles([$request->role]);

        return redirect()->route('staff.index')->with('success', 'Staff member updated.');
    }

    public function destroy(User $staff)
    {
        if ($staff->tenant_id !== auth()->user()->tenant_id) {
            abort(404);
        }

        if ($staff->id === auth()->id() || $staff->hasRole('owner')) {
            return back()->with('error', 'Cannot delete this user.');
        }

        $staff->delete();

        return redirect()->route('staff.index')->with('success', 'Staff member deleted.');
    }
}
