import { Head, Link, router } from '@inertiajs/react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Tenant {
    id: number;
    name: string;
    logo: string | null;
    billing_email: string | null;
    created_at: string;
    users_count: number;
    active_subscription: {
        id: number;
        status: string;
        expires_at: string;
        plan: { name: string } | null;
    } | null;
}

interface Props {
    tenants: {
        data: Tenant[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function Index({ tenants }: Props) {
    const deleteTenant = (id: number) => {
        if (
            confirm(
                'Are you sure you want to delete this tenant? This action cannot be undone.',
            )
        ) {
            router.delete(`/super-admin/tenants/${id}`);
        }
    };

    const statusBadge = (status: string | undefined) => {
        if (!status) return <Badge variant="secondary">No subscription</Badge>;
        const variants: Record<
            string,
            'default' | 'secondary' | 'destructive'
        > = {
            active: 'default',
            trial: 'secondary',
            cancelled: 'destructive',
            inactive: 'destructive',
        };
        return (
            <Badge variant={variants[status] ?? 'secondary'}>{status}</Badge>
        );
    };

    return (
        <>
            <Head title="Tenants" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Tenants
                        </h1>
                        <p className="text-muted-foreground">
                            Manage all registered tenants.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/super-admin/tenants/create">
                            <Plus className="mr-2 h-4 w-4" /> Add Tenant
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader className="p-0" />
                    <CardContent className="p-0">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Company
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Email
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Plan
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Status
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Users
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Joined
                                        </th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {tenants.data.map((tenant) => (
                                        <tr
                                            key={tenant.id}
                                            className="border-b transition-colors hover:bg-muted/50"
                                        >
                                            <td className="p-4 align-middle font-medium">
                                                {tenant.name}
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {tenant.billing_email ?? '—'}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {tenant.active_subscription
                                                    ?.plan?.name ?? '—'}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {statusBadge(
                                                    tenant.active_subscription
                                                        ?.status,
                                                )}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {tenant.users_count}
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {new Date(
                                                    tenant.created_at,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="space-x-2 p-4 text-right align-middle">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/super-admin/tenants/${tenant.id}`}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/super-admin/tenants/${tenant.id}/edit`}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        deleteTenant(tenant.id)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {tenants.links.length > 3 && (
                    <div className="flex justify-center gap-1">
                        {tenants.links.map((link, i) => (
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
