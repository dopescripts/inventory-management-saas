import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Plus, Trash, Eye } from 'lucide-react';
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
import customers from '@/routes/customers';

interface Customer {
    id: number;
    name: string;
    company_name: string | null;
    email: string | null;
    phone: string | null;
    status: string;
}

interface Props {
    customers: {
        data: Customer[];
        links: any[];
        meta: any;
    };
}

const columns: ColumnDef<Customer>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
            <span className="font-medium">{row.original.name}</span>
        ),
    },
    {
        accessorKey: 'company_name',
        header: 'Company',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <Badge
                variant={
                    row.original.status === 'active' ? 'default' : 'secondary'
                }
            >
                {row.original.status === 'active' ? 'Active' : 'Inactive'}
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
                                customers.show({ customer: row.original.id })
                                    .url
                            }
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={
                                customers.edit({ customer: row.original.id })
                                    .url
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
                                confirm(
                                    'Are you sure you want to delete this customer?',
                                )
                            ) {
                                router.delete(
                                    customers.destroy({
                                        customer: row.original.id,
                                    }).url,
                                );
                            }
                        }}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

export default function Index({ customers: paginatedCustomers }: Props) {
    return (
        <>
            <Head title="Customers" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Customers</h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage your customers and clients.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href={customers.create()}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Customer
                        </Link>
                    </Button>
                </div>

                <div className="rounded-lg border">
                    <DataTable
                        columns={columns}
                        data={paginatedCustomers.data}
                    />
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Sales',
            href: '',
        },
        {
            title: 'Customers',
            href: customers.index(),
        },
    ],
};
