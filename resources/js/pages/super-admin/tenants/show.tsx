import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Plan {
    id: number;
    name: string;
    price: string;
}

interface SubscriptionRecord {
    id: number;
    status: string;
    starts_at: string;
    expires_at: string;
    plan: Plan | null;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Currency {
    code: string;
    symbol: string;
}

interface TenantDetails {
    id: number;
    name: string;
    logo: string | null;
    billing_email: string | null;
    billing_phone: string | null;
    billing_address: string | null;
    tax_id: string | null;
    created_at: string;
    users: User[];
    active_subscription: SubscriptionRecord | null;
    currency: Currency | null;
}

interface Props {
    tenant: TenantDetails;
    subscriptionHistory: SubscriptionRecord[];
}

export default function Show({ tenant, subscriptionHistory }: Props) {
    return (
        <>
            <Head title={`Tenant: ${tenant.name}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/super-admin/tenants">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {tenant.name}
                        </h1>
                        <p className="text-muted-foreground">
                            Created{' '}
                            {new Date(tenant.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Billing Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <span className="text-sm text-muted-foreground">
                                    Email
                                </span>
                                <p>{tenant.billing_email ?? '—'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">
                                    Phone
                                </span>
                                <p>{tenant.billing_phone ?? '—'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">
                                    Address
                                </span>
                                <p>{tenant.billing_address ?? '—'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">
                                    Tax ID
                                </span>
                                <p>{tenant.tax_id ?? '—'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">
                                    Currency
                                </span>
                                <p>{tenant.currency?.code ?? 'USD'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Users ({tenant.users.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {tenant.users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {user.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Subscription History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="h-10 px-4 text-left font-medium text-muted-foreground">
                                            Plan
                                        </th>
                                        <th className="h-10 px-4 text-left font-medium text-muted-foreground">
                                            Status
                                        </th>
                                        <th className="h-10 px-4 text-left font-medium text-muted-foreground">
                                            Start
                                        </th>
                                        <th className="h-10 px-4 text-left font-medium text-muted-foreground">
                                            Expires
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscriptionHistory.map((sub) => (
                                        <tr key={sub.id} className="border-b">
                                            <td className="p-4">
                                                {sub.plan?.name ?? '—'}
                                            </td>
                                            <td className="p-4">
                                                <Badge
                                                    variant={
                                                        sub.status ===
                                                            'active' ||
                                                        sub.status === 'trial'
                                                            ? 'default'
                                                            : 'destructive'
                                                    }
                                                >
                                                    {sub.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {new Date(
                                                    sub.starts_at,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {new Date(
                                                    sub.expires_at,
                                                ).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {subscriptionHistory.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="p-4 text-center text-muted-foreground"
                                            >
                                                No subscription history.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
