import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import SuperAdminLayout from '@/layouts/super-admin/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BreadcrumbItem } from '@/types';

interface Plan {
    id: number;
    name: string;
    max_warehouses: number;
    max_items: number;
    max_orders: number;
    has_whatsapp: boolean;
    price: string;
    trial_days: number;
}

interface Props {
    plans: Plan[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Plans',
        href: '/super-admin/plans',
    },
];

export default function Index({ plans }: Props) {
    const deletePlan = (id: number) => {
        if (confirm('Are you sure you want to delete this plan?')) {
            router.delete(`/super-admin/plans/${id}`);
        }
    };

    return (
        <>
            <Head title="Plans" />

            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Subscription Plans</h1>
                        <p className="text-muted-foreground">Manage the available plans for your tenants.</p>
                    </div>
                    <Button asChild>
                        <Link href="/super-admin/plans/create">
                            <Plus className="mr-2 h-4 w-4" /> Add Plan
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader className="p-0"></CardHeader>
                        <CardContent className="p-0">
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Warehouses</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Items</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Orders/mo</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">WhatsApp</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Trial</th>
                                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {plans.map((plan) => (
                                            <tr key={plan.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <td className="p-4 align-middle font-medium">{plan.name}</td>
                                                <td className="p-4 align-middle">${parseFloat(plan.price).toFixed(2)}</td>
                                                <td className="p-4 align-middle">{plan.max_warehouses === -1 ? 'Unlimited' : plan.max_warehouses}</td>
                                                <td className="p-4 align-middle">{plan.max_items === -1 ? 'Unlimited' : plan.max_items}</td>
                                                <td className="p-4 align-middle">{plan.max_orders === -1 ? 'Unlimited' : plan.max_orders}</td>
                                                <td className="p-4 align-middle">
                                                    {plan.has_whatsapp ? (
                                                        <Badge variant="default">Yes</Badge>
                                                    ) : (
                                                        <Badge variant="secondary">No</Badge>
                                                    )}
                                                </td>
                                                <td className="p-4 align-middle">{plan.trial_days} days</td>
                                                <td className="p-4 align-middle text-right space-x-2">
                                                    <Button variant="outline" size="icon" asChild>
                                                        <Link href={`/super-admin/plans/${plan.id}/edit`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="text-destructive" onClick={() => deletePlan(plan.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {plans.length === 0 && (
                                            <tr>
                                                <td colSpan={8} className="p-4 text-center text-muted-foreground">
                                                    No plans found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
