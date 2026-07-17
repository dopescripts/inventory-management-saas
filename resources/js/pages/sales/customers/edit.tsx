import { Head } from '@inertiajs/react';
import React from 'react';
import customers from '@/routes/customers';
import CustomerForm from './components/customer-form';

interface Props {
    customer: any;
}

export default function Edit({ customer }: Props) {
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

Edit.layout = (page: React.ReactNode, props: any) => {
    return React.cloneElement(page as React.ReactElement, {
        breadcrumbs: [
            {
                title: 'Sales',
                href: '',
            },
            {
                title: 'Customers',
                href: customers.index(),
            },
            {
                title: 'Edit',
                href: customers.edit({ customer: props.customer.id }),
            },
        ],
    });
};
