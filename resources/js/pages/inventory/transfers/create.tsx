import { Head } from '@inertiajs/react';
import React from 'react';

import AppLayout from '@/layouts/app-layout';

import transfers from '@/routes/transfers';

import TransferForm from './components/transfer-form';

interface Item {
    id: number;
    name: string;
    sku: string;
}

interface Location {
    id: number;
    warehouse_id: number;
    code: string;
}

interface Warehouse {
    id: number;
    name: string;
    locations: Location[];
}

interface Props {
    warehouses: Warehouse[];
    items: Item[];
}

export default function Create({ warehouses, items }: Props) {
    return (
        <>
            <Head title="New Transfer" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 md:p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">New Transfer</h1>

                    <p className="mt-1 text-muted-foreground">
                        Create a stock transfer between warehouses or locations.
                    </p>
                </div>

                <TransferForm warehouses={warehouses} items={items} />
            </div>
        </>
    );
}

Create.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: 'Transfers',
                href: transfers.index(),
            },
            {
                title: 'New',
                href: transfers.create(),
            },
        ]}
    >
        {page}
    </AppLayout>
);
