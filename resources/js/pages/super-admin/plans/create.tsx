import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PlanForm from './form';


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
                <Card className="mx-auto max-w-2xl">
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
