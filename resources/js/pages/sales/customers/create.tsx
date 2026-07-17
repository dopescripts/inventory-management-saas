import { Head } from '@inertiajs/react';
import React from 'react';
import customers from '@/routes/customers';
import CustomerForm from './components/customer-form';

export default function Create() {
    return (
        <>
            <Head title="Create Customer" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div>
                    <h1 className="text-3xl font-bold">Create Customer</h1>
                    <p className="mt-1 text-muted-foreground">
                        Add a new customer to your organization.
                    </p>
                </div>

                <CustomerForm />
            </div>
        </>
    );
}

Create.layout = {
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
            title: 'Create',
            href: customers.create(),
        },
    ],
};
