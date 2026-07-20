<?php

namespace App\Providers;

use App\Contracts\PaymentServiceInterface;
use App\Http\Middleware\SetTenantForPermissions;
use App\Models\Transfers;
use App\Policies\TransferPolicy;
use App\Services\MockPaymentService;
use App\Services\PlanGate;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Http\Kernel;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(PlanGate::class, function ($app) {
            return new PlanGate;
        });

        $this->app->bind(PaymentServiceInterface::class, MockPaymentService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        /** @var Kernel $kernel */
        $kernel = app()->make(Kernel::class);

        $this->configureDefaults();
        $kernel->addToMiddlewarePriorityBefore(
            SetTenantForPermissions::class,
            SubstituteBindings::class,
        );

        Gate::policy(Transfers::class, TransferPolicy::class);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(
            fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
