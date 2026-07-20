import { Head } from '@inertiajs/react';
import {
    Building2,
    CreditCard,
    TrendingUp,
    UserPlus,
    AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlanDistribution {
    id: number;
    name: string;
    price: string;
    subscriptions_count: number;
}

interface Props {
    stats: {
        totalTenants: number;
        activeSubscriptions: number;
        monthlyRevenue: number;
        newSignupsThisMonth: number;
        expiringTrials: number;
    };
    planDistribution: PlanDistribution[];
}

export default function Dashboard({ stats, planDistribution }: Props) {
    return (
        <>
            <Head title="Super Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Overview of your SaaS platform.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Tenants
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalTenants}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Subscriptions
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.activeSubscriptions}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Monthly Revenue
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${stats.monthlyRevenue.toFixed(2)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                New This Month
                            </CardTitle>
                            <UserPlus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.newSignupsThisMonth}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Plan Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {planDistribution.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="font-medium">
                                                {plan.name}
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                $
                                                {parseFloat(plan.price).toFixed(
                                                    2,
                                                )}
                                                /mo
                                            </span>
                                        </div>
                                        <div className="font-semibold">
                                            {plan.subscriptions_count}
                                        </div>
                                    </div>
                                ))}
                                {planDistribution.length === 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        No active plans yet.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle>Expiring Trials</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {stats.expiringTrials}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Trials expiring in the next 7 days
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
