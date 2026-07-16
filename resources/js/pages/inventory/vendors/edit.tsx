import { Head } from '@inertiajs/react';
import React from 'react';
import vendors from '@/routes/vendors';
import VendorForm from './components/vendor-form';

interface Vendor {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    contact_person: string | null;
    notes: string | null;
    is_active: boolean;
}

interface Props {
    vendor: Vendor;
}

export default function Edit({ vendor }: Props) {
    return (
        <>
            <Head title={`Edit ${vendor.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div>
                    <h1 className="text-3xl font-bold">Edit Vendor</h1>
                    <p className="mt-1 text-muted-foreground">
                        Update vendor information.
                    </p>
                </div>

                <VendorForm vendor={vendor} />
            </div>
        </>
    );
}

Edit.layout = {
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
            title: 'Edit',
            href: '',
        },
    ],
};
