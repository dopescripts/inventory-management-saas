import { Head } from '@inertiajs/react';
import React from 'react';
import vendors from '@/routes/vendors';
import VendorForm from './components/vendor-form';

export default function Create() {
    return (
        <>
            <Head title="Create Vendor" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div>
                    <h1 className="text-3xl font-bold">Create Vendor</h1>
                    <p className="mt-1 text-muted-foreground">
                        Add a new supplier to your organization.
                    </p>
                </div>

                <VendorForm />
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Organization',
            href: '',
        },
        {
            title: 'Vendors',
            href: vendors.index(),
        },
        {
            title: 'Create',
            href: vendors.create(),
        },
    ],
};
