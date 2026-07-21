import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface PaymentItem {
    id: number;
    amount: string;
    currency: string;
    status: string;
    payment_method: string | null;
    transaction_id: string | null;
    paid_at: string | null;
    created_at: string;
    tenant: { id: number; name: string } | null;
}

interface Props {
    payments: {
        data: PaymentItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        status: string;
    };
}

export default function Index({ payments, filters }: Props) {
    const statusOptions = ['', 'pending', 'completed', 'failed', 'refunded'];

    const filterByStatus = (status: string) => {
        router.get(
            '/super-admin/payments',
            { status: status || undefined },
            { preserveState: true },
        );
    };

    const statusBadgeVariant = (
        status: string,
    ): 'default' | 'secondary' | 'destructive' => {
        if (status === 'completed') {
            return 'default';
        }

        if (status === 'pending') {
            return 'secondary';
        }

        return 'destructive';
    };

    return (
        <>
            <Head title="Payments" />

            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Payments
                    </h1>
                    <p className="text-muted-foreground">
                        View all payment transactions.
                    </p>
                </div>

                <div className="flex gap-2">
                    {statusOptions.map((s) => (
                        <Button
                            key={s || 'all'}
                            variant={
                                filters.status === s ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() => filterByStatus(s)}
                        >
                            {s || 'All'}
                        </Button>
                    ))}
                </div>

                <Card>
                    <CardHeader className="p-0" />
                    <CardContent className="p-0">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Tenant
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Amount
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Status
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Method
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Transaction ID
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {payments.data.map((payment) => (
                                        <tr
                                            key={payment.id}
                                            className="border-b transition-colors hover:bg-muted/50"
                                        >
                                            <td className="p-4 align-middle font-medium">
                                                {payment.tenant?.name ?? '—'}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {payment.currency}{' '}
                                                {parseFloat(
                                                    payment.amount,
                                                ).toFixed(2)}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge
                                                    variant={statusBadgeVariant(
                                                        payment.status,
                                                    )}
                                                >
                                                    {payment.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {payment.payment_method ?? '—'}
                                            </td>
                                            <td className="p-4 align-middle font-mono text-xs text-muted-foreground">
                                                {payment.transaction_id
                                                    ? payment.transaction_id.substring(
                                                          0,
                                                          20,
                                                      ) + '...'
                                                    : '—'}
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {payment.paid_at
                                                    ? new Date(
                                                          payment.paid_at,
                                                      ).toLocaleDateString()
                                                    : new Date(
                                                          payment.created_at,
                                                      ).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {payments.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="p-4 text-center text-muted-foreground"
                                            >
                                                No payments found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {payments.links.length > 3 && (
                    <div className="flex justify-center gap-1">
                        {payments.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                asChild={!!link.url}
                            >
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                )}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
