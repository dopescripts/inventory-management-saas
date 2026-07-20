import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

interface Plan {
    id: number;
    name: string;
    price: string;
}

interface SubscriptionDetails {
    id: number;
    status: string;
    starts_at: string;
    expires_at: string;
    tenant: { id: number; name: string } | null;
    plan: Plan | null;
}

interface Props {
    subscription: SubscriptionDetails;
    plans: Plan[];
}

export default function Show({ subscription, plans }: Props) {
    const changePlanForm = useForm({
        plan_id: subscription.plan?.id?.toString() ?? '',
    });

    const handleCancel = () => {
        if (
            confirm(
                'Are you sure you want to cancel this subscription? This cannot be undone.',
            )
        ) {
            router.post(
                `/super-admin/subscriptions/${subscription.id}/cancel`,
            );
        }
    };

    const handleChangePlan = (e: React.FormEvent) => {
        e.preventDefault();
        changePlanForm.post(
            `/super-admin/subscriptions/${subscription.id}/change-plan`,
        );
    };

    const isActive =
        subscription.status === 'active' || subscription.status === 'trial';

    return (
        <>
            <Head title={`Subscription #${subscription.id}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/super-admin/subscriptions">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Subscription #{subscription.id}
                        </h1>
                        <p className="text-muted-foreground">
                            {subscription.tenant?.name}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Subscription Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Status
                                </span>
                                <Badge
                                    variant={
                                        isActive ? 'default' : 'destructive'
                                    }
                                >
                                    {subscription.status}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Plan
                                </span>
                                <span className="font-medium">
                                    {subscription.plan?.name ?? '—'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Price
                                </span>
                                <span className="font-medium">
                                    $
                                    {subscription.plan
                                        ? parseFloat(
                                              subscription.plan.price,
                                          ).toFixed(2)
                                        : '0.00'}
                                    /mo
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Start Date
                                </span>
                                <span>
                                    {new Date(
                                        subscription.starts_at,
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Expires
                                </span>
                                <span>
                                    {new Date(
                                        subscription.expires_at,
                                    ).toLocaleDateString()}
                                </span>
                            </div>

                            {isActive && (
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={handleCancel}
                                >
                                    Cancel Subscription
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {isActive && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Plan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleChangePlan}
                                    className="space-y-4"
                                >
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={changePlanForm.data.plan_id}
                                        onChange={(e) =>
                                            changePlanForm.setData(
                                                'plan_id',
                                                e.target.value,
                                            )
                                        }
                                    >
                                        {plans.map((plan) => (
                                            <option
                                                key={plan.id}
                                                value={plan.id}
                                            >
                                                {plan.name} ($
                                                {parseFloat(
                                                    plan.price,
                                                ).toFixed(2)}
                                                /mo)
                                            </option>
                                        ))}
                                    </select>
                                    <Button
                                        type="submit"
                                        disabled={
                                            changePlanForm.processing
                                        }
                                        className="w-full"
                                    >
                                        {changePlanForm.processing && (
                                            <Spinner className="mr-2" />
                                        )}
                                        Update Plan
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}
