import { Head, useForm } from '@inertiajs/react';
import SuperAdminLayout from '@/layouts/super-admin/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PlanForm from './form';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Plans',
        href: '/super-admin/plans',
    },
    {
        title: 'Create',
        href: '/super-admin/plans/create',
    },
];

export default function Create() {
    const form = useForm({
        name: '',
        max_warehouses: 1,
        max_items: 50,
        max_orders: 20,
        has_whatsapp: false,
        price: 0,
        trial_days: 14,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/super-admin/plans');
    };

    return (
        <>
            <Head title="Create Plan" />

            <div className="p-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Create New Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PlanForm form={form} submit={submit} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
