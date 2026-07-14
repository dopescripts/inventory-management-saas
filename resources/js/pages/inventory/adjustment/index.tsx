import { Head, Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import React from 'react';
import { InertiaPagination } from '@/components/inertia-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import adjustmentsRoutes from '@/routes/adjustments';

interface Adjustment {
    id: number;
    reference_type: string;
    direction: string;
    quantity: string;
    balance_after: string;
    notes: string | null;
    created_at: string;
    item: {
        id: number;
        name: string;
        sku: string;
    };
    warehouse: {
        id: number;
        name: string;
    };
    location?: {
        id: number;
        code: string;
    } | null;
    performed_by: {
        id: number;
        name: string;
    } | null;
}

const columns: ColumnDef<Adjustment>[] = [
    {
        accessorKey: 'created_at',
        header: 'Date',
        cell: ({ row }) =>
            new Date(row.original.created_at).toLocaleDateString(),
    },
    {
        accessorKey: 'item.name',
        header: 'Item',
        cell: ({ row }) => (
            <div>
                <span className="font-medium">{row.original.item.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                    {row.original.item.sku}
                </span>
            </div>
        ),
    },
    {
        accessorKey: 'warehouse.name',
        header: 'Location',
        cell: ({ row }) => (
            <div>
                <span>{row.original.warehouse.name}</span>
                {row.original.location && (
                    <span className="ml-1 text-muted-foreground">
                        / {row.original.location.code}
                    </span>
                )}
            </div>
        ),
    },
    {
        accessorKey: 'direction',
        header: 'Adjustment',
        cell: ({ row }) => {
            const dir = row.original.direction;
            const isIncrease = dir === 'in';

            return (
                <Badge
                    variant={isIncrease ? 'default' : 'secondary'}
                    className={
                        isIncrease
                            ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                            : ''
                    }
                >
                    {isIncrease ? '+' : '-'}
                    {Number(row.original.quantity)}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'notes',
        header: 'Reason / Notes',
        cell: ({ row }) => (
            <span
                className="inline-block max-w-[200px] truncate text-muted-foreground"
                title={row.original.notes || ''}
            >
                {row.original.notes || '-'}
            </span>
        ),
    },
    {
        accessorKey: 'performed_by.name',
        header: 'Performed By',
        cell: ({ row }) => row.original.performed_by?.name || 'System',
    },
];

export default function Index({ adjustments }: { adjustments: any }) {
    return (
        <>
            <Head title="Inventory Adjustments" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Adjustments</h1>
                        <p className="mt-1 text-muted-foreground">
                            Record and track manual stock changes.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={adjustmentsRoutes.create()}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Adjustment
                        </Link>
                    </Button>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <DataTable columns={columns} data={adjustments.data} />
                </div>
                <InertiaPagination links={adjustments.links} />
            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Adjustments', href: adjustmentsRoutes.index() },
        ]}
    >
        {page}
    </AppLayout>
);
