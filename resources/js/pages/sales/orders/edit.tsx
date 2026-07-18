import { Head, setLayoutProps } from '@inertiajs/react';
import React from 'react';
import orders from '@/routes/orders';
import SalesOrderForm from './components/sales-order-form';

interface Props {
    salesOrder: any;
    customers: any[];
    warehouses: any[];
    items: any[];
}

export default function Edit({ salesOrder, customers, warehouses, items }: Props) {
    setLayoutProps({
        breadcrumbs: [
            { title: 'Sales', href: '' },
            { title: 'Orders', href: orders.index() },
            { title: salesOrder.number, href: orders.show({ order: salesOrder.id }) },
            { title: 'Edit', href: orders.edit({ order: salesOrder.id }) },
        ],
    });

    return (
        <>
            <Head title={`Edit ${salesOrder.number}`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div>
                    <h1 className="text-3xl font-bold">Edit {salesOrder.number}</h1>
                    <p className="mt-1 text-muted-foreground">
                        Modify the details of this draft sales order.
                    </p>
                </div>

                <SalesOrderForm
                    customers={customers}
                    warehouses={warehouses}
                    items={items}
                    salesOrder={salesOrder}
                />
            </div>
        </>
    );
}
