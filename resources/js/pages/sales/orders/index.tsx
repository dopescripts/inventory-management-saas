import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, MoreHorizontal, Plus, Trash } from 'lucide-react';
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
import { useCurrency } from '@/lib/currency';
import orders from '@/routes/orders';

interface SalesOrder {
    id: number;
    number: string;
    status: string;
    customer: { id: number; name: string } | null;
    warehouse: { id: number; name: string } | null;
    order_date: string;
    expected_ship_date: string | null;
    total: string | number;
}

interface Props {
    salesOrders: {
        data: SalesOrder[];
        links: any[];
        meta: any;
    };
}

const statusVariant = (
    status: string,
): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
        case 'confirmed':
            return 'default';
        case 'draft':
            return 'secondary';
        case 'cancelled':
            return 'destructive';
        default:
            return 'outline';
    }
};

export default function Index({ salesOrders }: Props) {
    const { format } = useCurrency();

    const columns: ColumnDef<SalesOrder>[] = [
        {
            accessorKey: 'number',
            header: 'Order #',
            cell: ({ row }) => (
                <span className="font-medium">{row.original.number}</span>
            ),
        },
        {
            accessorKey: 'customer.name',
            header: 'Customer',
        },
        {
            accessorKey: 'warehouse.name',
            header: 'Warehouse',
        },
        {
            accessorKey: 'order_date',
            header: 'Order Date',
            cell: ({ row }) =>
                new Date(row.original.order_date).toLocaleDateString(),
        },
        {
            accessorKey: 'expected_ship_date',
            header: 'Ship By',
            cell: ({ row }) =>
                row.original.expected_ship_date
                    ? new Date(
                          row.original.expected_ship_date,
                      ).toLocaleDateString()
                    : '—',
        },
        {
            accessorKey: 'total',
            header: 'Total',
            cell: ({ row }) => format(row.original.total),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={statusVariant(row.original.status)}>
                    {row.original.status
                        .replace(/_/g, ' ')
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
                                href={
                                    orders.show({ order: row.original.id }).url
                                }
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </Link>
                        </DropdownMenuItem>
                        {row.original.status === 'draft' && (
                            <>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={
                                            orders.edit({
                                                order: row.original.id,
                                            }).url
                                        }
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => {
                                        if (
                                            confirm('Delete this sales order?')
                                        ) {
                                            router.delete(
                                                orders.destroy({
                                                    order: row.original.id,
                                                }).url,
                                            );
                                        }
                                    }}
                                >
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

    return (
        <>
            <Head title="Sales Orders" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Sales Orders</h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage customer sales orders.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={orders.create()}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Order
                        </Link>
                    </Button>
                </div>

                <div className="rounded-lg border">
                    <DataTable columns={columns} data={salesOrders.data} />
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Sales', href: '' },
        { title: 'Orders', href: orders.index() },
    ],
};
