import React from 'react';
import { Head } from '@inertiajs/react';

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

interface TransferItem {
    item_id: number;
    quantity_requested: number;
    remarks: string | null;
}

interface Transfer {
    id: number;

    source_warehouse_id: number | null;
    source_location_id: number | null;

    destination_warehouse_id: number | null;
    destination_location_id: number | null;

    notes: string | null;

    items: TransferItem[];
}

interface Props {
    transfer: Transfer;
    warehouses: Warehouse[];
    items: Item[];
}

export default function Edit({
    transfer,
    warehouses,
    items,
}: Props) {
    return (
        <>
            <Head
                title={`Edit ${transfer.id}`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 md:p-6">

                <div className="mb-6">
                    <h1 className="text-3xl font-bold">
                        Edit Transfer
                    </h1>

                    <p className="mt-1 text-muted-foreground">
                        Update transfer information before it is submitted.
                    </p>
                </div>

                <TransferForm
                    transfer={transfer}
                    warehouses={warehouses}
                    items={items}
                />

            </div>
        </>
    );
}

Edit.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: 'Transfers',
                href: transfers.index(),
            },
            {
                title: 'Edit',
                href: '#',
            },
        ]}
    >
        {page}
    </AppLayout>
);