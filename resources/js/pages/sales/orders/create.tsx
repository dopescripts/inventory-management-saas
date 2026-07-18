import { Head } from '@inertiajs/react';
import React from 'react';
import orders from '@/routes/orders';
import SalesOrderForm from './components/sales-order-form';

interface Props {
    customers: any[];
    warehouses: any[];
    items: any[];
}

export default function Create({ customers, warehouses, items }: Props) {
    return (
        <>
            <Head title="Create Sales Order" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div>
                    <h1 className="text-3xl font-bold">Create Sales Order</h1>
                    <p className="mt-1 text-muted-foreground">
                        Create a new sales order for a customer.
                    </p>
                </div>

                <SalesOrderForm customers={customers} warehouses={warehouses} items={items} />
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Sales', href: '' },
        { title: 'Orders', href: orders.index() },
        { title: 'Create', href: orders.create() },
    ],
};
