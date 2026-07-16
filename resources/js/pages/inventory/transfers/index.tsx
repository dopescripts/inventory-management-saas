import { Head, Link } from '@inertiajs/react';




import type { ColumnDef } from '@tanstack/react-table';

import { MoreHorizontal, Eye, Edit, Trash, Plus } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import transfers from '@/routes/transfers';

interface Transfer {
    id: number;
    transfer_number: string;
    status: string;

    source_warehouse?: {
        id: number;
        name: string;
    };

    destination_warehouse?: {
        id: number;
        name: string;
    };

    requested_by?: {
        id: number;
        name: string;
    };

    items_count: number;

    requested_at: string;

    can_edit?: boolean;
    can_delete?: boolean;
}

interface Props {
    transfers: {
        data: Transfer[];
        links: any[];
        meta: any;
    };
}

const statusVariant = (status: string) => {
    switch (status) {
        case 'draft':
            return 'secondary';

        case 'pending_approval':
            return 'outline';

        case 'approved':
            return 'default';

        case 'processing':
            return 'default';

        case 'complete':
            return 'default';

        case 'cancelled':
            return 'destructive';

        default:
            return 'secondary';
    }
};

const columns: ColumnDef<Transfer>[] = [
    {
        accessorKey: 'transfer_number',
        header: 'Transfer #',

        cell: ({ row }) => (
            <span className="font-medium">{row.original.transfer_number}</span>
        ),
    },

    {
        id: 'route',

        header: 'Route',

        cell: ({ row }) => (
            <div className="text-sm">
                <div>{row.original.source_warehouse?.name}</div>

                <div className="text-muted-foreground">↓</div>

                <div>{row.original.destination_warehouse?.name}</div>
            </div>
        ),
    },

    {
        accessorKey: 'items_count',

        header: 'Items',
    },

    {
        accessorKey: 'requested_by.name',

        header: 'Requested By',
    },

    {
        accessorKey: 'requested_at',

        header: 'Requested',

        cell: ({ row }) =>
            new Date(row.original.requested_at).toLocaleDateString(),
    },

    {
        accessorKey: 'status',

        header: 'Status',

        cell: ({ row }) => (
            <Badge variant={statusVariant(row.original.status) as any}>
                {row.original.status
                    .replaceAll('_', ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
            </Badge>
        ),
    },

    {
        id: 'actions',

        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link
                            href={transfers.show({
                                transfer: row.original.id,
                            })}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                        </Link>
                    </DropdownMenuItem>

                    {row.original.can_edit && (
                        <DropdownMenuItem asChild>
                            <Link
                                href={transfers.edit({
                                    transfer: row.original.id,
                                })}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                    )}

                    {row.original.can_delete && (
                        <>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem className="text-destructive">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

export default function Index({ transfers: paginatedTransfers }: Props) {
    return (
        <>
            <Head title="Transfers" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Transfers</h1>

                        <p className="mt-1 text-muted-foreground">
                            Move inventory between warehouses and locations.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href={transfers.create()}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Transfer
                        </Link>
                    </Button>
                </div>

                <div className="rounded-lg border">
                    <DataTable
                        columns={columns}
                        data={paginatedTransfers.data}
                    />
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Inventory',
            href: '',
        },
        {
            title: 'Transfers',
            href: transfers.index(),
        },
    ],
};
