import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Plus, Trash } from 'lucide-react';
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
import vendors from '@/routes/vendors';

interface Vendor {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    contact_person: string | null;
    is_active: boolean;
}

interface Props {
    vendors: {
        data: Vendor[];
        links: any[];
        meta: any;
    };
}

const columns: ColumnDef<Vendor>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
            <span className="font-medium">{row.original.name}</span>
        ),
    },
    {
        accessorKey: 'contact_person',
        header: 'Contact Person',
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
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => (
            <Badge variant={row.original.is_active ? 'default' : 'secondary'}>
                {row.original.is_active ? 'Active' : 'Inactive'}
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
                            href={vendors.edit({ vendor: row.original.id }).url}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive"
                        onClick={() =>
                            router.delete(
                                vendors.destroy({ vendor: row.original.id })
                                    .url,
                            )
                        }
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

export default function Index({ vendors: paginatedVendors }: Props) {
    return (
        <>
            <Head title="Vendors" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Vendors</h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage your suppliers and vendor contacts.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href={vendors.create()}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Vendor
                        </Link>
                    </Button>
                </div>

                <div className="rounded-lg border">
                    <DataTable
                        columns={columns}
                        data={paginatedVendors.data}
                    />
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Organization',
            href: '',
        },
        {
            title: 'Vendors',
            href: vendors.index(),
        },
    ],
};
