import { Head } from '@inertiajs/react';
import React from 'react';
import purchases from '@/routes/purchases';
import PurchaseForm from './components/purchase-form';

interface Props {
    purchaseOrder: any;
    vendors: { id: number; name: string }[];
    items: { id: number; name: string; sku: string }[];
}

export default function Edit({ purchaseOrder, vendors, items }: Props) {
    return (
        <>
            <Head title={`Edit ${purchaseOrder.purchase_number}`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div>
                    <h1 className="text-3xl font-bold">
                        Edit {purchaseOrder.purchase_number}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Modify this purchase order.
                    </p>
                </div>
                <PurchaseForm
                    vendors={vendors}
                    items={items}
                    purchaseOrder={purchaseOrder}
                />
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Purchasing', href: '' },
        { title: 'Purchase Orders', href: purchases.index() },
        {
            title: 'Edit',
            href: purchases.edit({ purchase_order: 0 }),
        },
    ],
};
