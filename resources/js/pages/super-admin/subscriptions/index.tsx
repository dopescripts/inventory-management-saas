import { Head, Link, router } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface SubscriptionItem {
    id: number;
    status: string;
    starts_at: string;
    expires_at: string;
    tenant: { id: number; name: string } | null;
    plan: { id: number; name: string; price: string } | null;
}

interface Props {
    subscriptions: {
        data: SubscriptionItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        status: string;
    };
}

export default function Index({ subscriptions, filters }: Props) {
    const statusOptions = ['', 'trial', 'active', 'inactive', 'cancelled'];

    const filterByStatus = (status: string) => {
        router.get(
            '/super-admin/subscriptions',
            { status: status || undefined },
            { preserveState: true },
        );
    };

    const statusBadgeVariant = (
        status: string,
    ): 'default' | 'secondary' | 'destructive' => {
        if (status === 'active') return 'default';
        if (status === 'trial') return 'secondary';
        return 'destructive';
    };

    return (
        <>
            <Head title="Subscriptions" />

            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Subscriptions
                    </h1>
                    <p className="text-muted-foreground">
                        View and manage all tenant subscriptions.
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
                                            Plan
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Status
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Starts
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Expires
                                        </th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {subscriptions.data.map((sub) => (
                                        <tr
                                            key={sub.id}
                                            className="border-b transition-colors hover:bg-muted/50"
                                        >
                                            <td className="p-4 align-middle font-medium">
                                                {sub.tenant?.name ?? '—'}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {sub.plan?.name ?? '—'}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge
                                                    variant={statusBadgeVariant(
                                                        sub.status,
                                                    )}
                                                >
                                                    {sub.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {new Date(
                                                    sub.starts_at,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {new Date(
                                                    sub.expires_at,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right align-middle">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/super-admin/subscriptions/${sub.id}`}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {subscriptions.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="p-4 text-center text-muted-foreground"
                                            >
                                                No subscriptions found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {subscriptions.links.length > 3 && (
                    <div className="flex justify-center gap-1">
                        {subscriptions.links.map((link, i) => (
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
