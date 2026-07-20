import { Head } from '@inertiajs/react';
import React from 'react';
import purchases from '@/routes/purchases';
import PurchaseForm from './components/purchase-form';

interface Props {
    vendors: { id: number; name: string }[];
    items: { id: number; name: string; sku: string }[];
}

export default function Create({ vendors, items }: Props) {
    return (
        <>
            <Head title="Create Purchase Order" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div>
                    <h1 className="text-3xl font-bold">
                        Create Purchase Order
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Create a new purchase order for a vendor.
                    </p>
                </div>
                <PurchaseForm vendors={vendors} items={items} />
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Purchasing', href: '' },
        { title: 'Purchase Orders', href: purchases.index() },
        { title: 'Create', href: purchases.create() },
    ],
};
