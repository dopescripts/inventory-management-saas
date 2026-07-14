import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PlanForm from './form';

interface Plan {
    id: number;
    name: string;
    max_warehouses: number;
    max_items: number;
    max_orders: number;
    has_whatsapp: boolean;
    price: string | number;
    trial_days: number;
}

interface Props {
    plan: Plan;
}

export default function Edit({ plan }: Props) {

    const form = useForm({
        name: plan.name,
        max_warehouses: plan.max_warehouses,
        max_items: plan.max_items,
        max_orders: plan.max_orders,
        has_whatsapp: !!plan.has_whatsapp,
        price: plan.price,
        trial_days: plan.trial_days,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/super-admin/plans/${plan.id}`);
    };

    return (
        <>
            <Head title={`Edit Plan: ${plan.name}`} />

            <div className="p-6">
                <Card className="mx-auto max-w-2xl">
                    <CardHeader>
                        <CardTitle>Edit Plan: {plan.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PlanForm form={form} submit={submit} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
