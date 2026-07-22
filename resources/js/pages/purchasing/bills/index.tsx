import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Download, Eye, MoreHorizontal } from 'lucide-react';
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
import bills from '@/routes/bills';

interface Bill {
    id: number;
    bill_number: string;
    status: string;
    total: string;
    paid_amount: string;
    due_date: string | null;
    issued_at: string | null;
    created_at: string;
    purchase_order?: { id: number; purchase_number: string };
    vendor?: { id: number; name: string };
}

interface Props {
    bills: {
        data: Bill[];
        links: any[];
        meta: any;
    };
}

const statusVariant = (status: string) => {
    switch (status) {
        case 'draft':
            return 'secondary';
        case 'pending':
            return 'outline';
        case 'partially_paid':
            return 'default';
        case 'paid':
            return 'default';
        case 'overdue':
            return 'destructive';
        case 'cancelled':
            return 'destructive';
        default:
            return 'secondary';
    }
};

export default function Index({ bills: paginatedBills }: Props) {
    const { format } = useCurrency();

    const columns: ColumnDef<Bill>[] = [
        {
            accessorKey: 'bill_number',
            header: 'Bill #',
            cell: ({ row }) => (
                <span className="font-medium">{row.original.bill_number}</span>
            ),
        },
        {
            accessorKey: 'purchase_order.purchase_number',
            header: 'PO #',
            cell: ({ row }) =>
                row.original.purchase_order?.purchase_number ?? '—',
        },
        {
            accessorKey: 'vendor.name',
            header: 'Vendor',
            cell: ({ row }) => row.original.vendor?.name ?? '—',
        },
        {
            accessorKey: 'total',
            header: 'Total',
            cell: ({ row }) => format(row.original.total),
        },
        {
            accessorKey: 'paid_amount',
            header: 'Paid',
            cell: ({ row }) => format(row.original.paid_amount),
        },
        {
            accessorKey: 'due_date',
            header: 'Due Date',
            cell: ({ row }) =>
                row.original.due_date
                    ? new Date(row.original.due_date).toLocaleDateString()
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
                            <Link href={bills.show({ bill: row.original.id })}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <a
                                href={
                                    bills.download({ bill: row.original.id })
                                        .url
                                }
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </a>
                        </DropdownMenuItem>
                        {row.original.status === 'draft' && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() =>
                                        router.post(
                                            bills.cancel({
                                                bill: row.original.id,
                                            }),
                                        )
                                    }
                                >
                                    Cancel
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
            <Head title="Purchase Bills" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Purchase Bills</h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage vendor bills and payments.
                        </p>
                    </div>
                    {/* <Button asChild>
                        <Link href={bills.create()}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Bill
                        </Link>
                    </Button> */}
                </div>

                <div className="rounded-lg border">
                    <DataTable columns={columns} data={paginatedBills.data} />
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Purchasing', href: '' },
        { title: 'Bills', href: bills.index() },
    ],
};
