import { useForm } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

interface Plan {
    id: number;
    name: string;
    price: string;
    billing_period: string;
    max_warehouses: number;
    max_items: number;
    max_orders: number;
    has_whatsapp: boolean;
    description: string | null;
    features: string[] | null;
}

interface Props {
    plans: Plan[];
    currentPlanId: number | null;
}

export default function PlanSelectionStep({ plans, currentPlanId }: Props) {
    const [selectedPlan, setSelectedPlan] = useState<number | null>(
        currentPlanId,
    );
    const { post, processing } = useForm({});

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPlan) {
            return;
        }

        post(`/onboarding/plan?plan_id=${selectedPlan}`);
    };

    const formatLimit = (value: number) =>
        value === -1 ? 'Unlimited' : value.toLocaleString();

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                {plans.map((plan) => (
                    <Card
                        key={plan.id}
                        className={`cursor-pointer transition-all ${
                            selectedPlan === plan.id
                                ? 'ring-2 ring-primary'
                                : 'hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedPlan(plan.id)}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold">{plan.name}</h3>
                                {currentPlanId === plan.id && (
                                    <Badge variant="secondary">Current</Badge>
                                )}
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold">
                                    ${parseFloat(plan.price).toFixed(0)}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    /
                                    {plan.billing_period === 'yearly'
                                        ? 'year'
                                        : 'month'}
                                </span>
                            </div>
                            {plan.description && (
                                <p className="text-sm text-muted-foreground">
                                    {plan.description}
                                </p>
                            )}
                        </CardHeader>
                        <CardContent className="pt-0">
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    {formatLimit(plan.max_warehouses)}{' '}
                                    warehouses
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    {formatLimit(plan.max_items)} items
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    {formatLimit(plan.max_orders)} orders/month
                                </li>
                                {plan.has_whatsapp && (
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        WhatsApp integration
                                    </li>
                                )}
                                {plan.features?.map((feature, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-2"
                                    >
                                        <Check className="h-4 w-4 text-primary" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={processing || !selectedPlan}
            >
                {processing && <Spinner />}
                Continue
            </Button>
        </form>
    );
}
