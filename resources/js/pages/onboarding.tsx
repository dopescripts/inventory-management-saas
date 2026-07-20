import { Head } from '@inertiajs/react';
import CompanyDetailsStep from '@/components/onboarding/company-details-step';
import PaymentStep from '@/components/onboarding/payment-step';
import PlanSelectionStep from '@/components/onboarding/plan-selection-step';
import WelcomeStep from '@/components/onboarding/welcome-step';

interface Plan {
    id: number;
    name: string;
    description: string | null;
    price: string;
    yearly_price: string | null;
    billing_period: string;
    max_warehouses: number;
    max_items: number;
    max_orders: number;
    has_whatsapp: boolean;
    features: string[] | null;
}

interface TenantData {
    id: number;
    name: string;
    logo: string | null;
    billing_address: string | null;
    billing_phone: string | null;
    billing_email: string | null;
    tax_id: string | null;
}

interface Props {
    step: number;
    tenant: TenantData;
    plans: Plan[];
    selectedPlanId: number | null;
}

const steps = ['Company Details', 'Select Plan', 'Payment', 'Welcome'];

export default function Onboarding({
    step,
    tenant,
    plans,
    selectedPlanId,
}: Props) {
    const selectedPlan = plans.find((p) => p.id === selectedPlanId);
    // console.log(selectedPlan);

    return (
        <>
            <Head title="Setup Your Account" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
                <div className="w-full max-w-2xl">
                    <div className="mb-8">
                        <h1 className="text-center text-2xl font-bold">
                            Set Up Your Account
                        </h1>
                        <p className="mt-2 text-center text-sm text-muted-foreground">
                            Complete these steps to get started
                        </p>
                    </div>

                    <div className="mb-8 flex items-center justify-center gap-2">
                        {steps.map((label, index) => (
                            <div
                                key={label}
                                className="flex items-center gap-2"
                            >
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                                        index + 1 < step
                                            ? 'bg-primary text-primary-foreground'
                                            : index + 1 === step
                                              ? 'bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2'
                                              : 'bg-muted text-muted-foreground'
                                    }`}
                                >
                                    {index + 1 < step ? '✓' : index + 1}
                                </div>
                                <span
                                    className={`hidden text-sm sm:inline ${
                                        index + 1 === step
                                            ? 'font-medium'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    {label}
                                </span>
                                {index < steps.length - 1 && (
                                    <div className="mx-2 h-px w-8 bg-border" />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        {step === 1 && <CompanyDetailsStep tenant={tenant} />}
                        {step === 2 && (
                            <PlanSelectionStep
                                plans={plans}
                                currentPlanId={selectedPlanId}
                            />
                        )}
                        {step === 3 && selectedPlan && (
                            <PaymentStep
                                planName={selectedPlan.name}
                                planPrice={selectedPlan.price}
                            />
                        )}
                        {step === 4 && <WelcomeStep />}
                    </div>
                </div>
            </div>
        </>
    );
}

Onboarding.layout = false;
