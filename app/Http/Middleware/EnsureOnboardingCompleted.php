<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOnboardingCompleted
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->tenant && $user->tenant->onboarding_completed_at === null) {
            if ($user->hasRole('owner')) {
                return redirect()->route('onboarding.show');
            }
            abort(403, 'Your organization has not completed onboarding yet. Please wait for the owner to complete the setup.');
        }

        return $next($request);
    }
}
