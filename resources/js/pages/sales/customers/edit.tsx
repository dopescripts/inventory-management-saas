import { Head, setLayoutProps } from '@inertiajs/react';
import React from 'react';
import customers from '@/routes/customers';
import CustomerForm from './components/customer-form';

interface Props {
    customer: any;
}

export default function Edit({ customer }: Props) {
    setLayoutProps({
        breadcrumbs: [
            { title: 'Sales', href: '' },
            { title: 'Customers', href: customers.index() },
            {
                title: customer.name,
                href: customers.show({ customer: customer.id }),
            },
            { title: 'Edit', href: customers.edit({ customer: customer.id }) },
        ],
    });

    return (
        <>
            <Head title={`Edit ${customer.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div>
                    <h1 className="text-3xl font-bold">Edit Customer</h1>
                    <p className="mt-1 text-muted-foreground">
                        Update customer details and preferences.
                    </p>
                </div>

                <CustomerForm customer={customer} />
            </div>
        </>
    );
}
