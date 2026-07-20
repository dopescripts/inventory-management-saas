import { Head, Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, MoreHorizontal, Plus, Trash } from 'lucide-react';
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
import purchases from '@/routes/purchases';

interface PurchaseOrder {
    id: number;
    purchase_number: string;
    status: string;
    vendor?: { id: number; name: string };
    ordered_by?: { id: number; name: string };
    items_count: number;
    total: string;
    expected_date: string | null;
    created_at: string;
}

interface Props {
    purchaseOrders: {
        data: PurchaseOrder[];
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
        case 'partially_received':
            return 'default';
        case 'received':
            return 'default';
        case 'closed':
            return 'secondary';
        case 'cancelled':
            return 'destructive';
        default:
            return 'secondary';
    }
};

export default function Index({ purchaseOrders }: Props) {
    const { format } = useCurrency();

    const columns: ColumnDef<PurchaseOrder>[] = [
        {
            accessorKey: 'purchase_number',
            header: 'PO #',
            cell: ({ row }) => (
                <span className="font-medium">
                    {row.original.purchase_number}
                </span>
            ),
        },
        {
            accessorKey: 'vendor.name',
            header: 'Vendor',
        },
        {
            accessorKey: 'items_count',
            header: 'Items',
        },
        {
            accessorKey: 'total',
            header: 'Total',
            cell: ({ row }) => <span>{format(row.original.total)}</span>,
        },
        {
            accessorKey: 'ordered_by.name',
            header: 'Ordered By',
        },
        {
            accessorKey: 'expected_date',
            header: 'Expected',
            cell: ({ row }) =>
                row.original.expected_date
                    ? new Date(row.original.expected_date).toLocaleDateString()
                    : '—',
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
                                href={purchases.show({
                                    purchase_order: row.original.id,
                                })}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </Link>
                        </DropdownMenuItem>
                        {row.original.status === 'draft' && (
                            <>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={purchases.edit({
                                            purchase_order: row.original.id,
                                        })}
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
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

    return (
        <>
            <Head title="Purchase Orders" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Purchase Orders</h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage purchase orders from vendors.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={purchases.create()}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Purchase Order
                        </Link>
                    </Button>
                </div>

                <div className="rounded-lg border">
                    <DataTable columns={columns} data={purchaseOrders.data} />
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Purchasing', href: '' },
        { title: 'Purchase Orders', href: purchases.index() },
    ],
};
