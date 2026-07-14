import { Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Edit, Trash } from 'lucide-react';
import { ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import warehouses from '@/routes/warehouses';

export function getColumns(auth: any): ColumnDef<any>[] {

    return [
        {
            accessorKey: 'name',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        Warehouse
                        < ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button >
                );
            },
            cell: ({ row }) => {
                const name = row.getValue('name') as string;
                const code = row.original.code;

                return (
                    <div className="flex flex-col">
                        <span className="font-medium text-foreground">{name}</span>
                        <span className="text-xs text-muted-foreground uppercase">
                            {code}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'location',
            header: 'Address',
            cell: ({ row }) => {
                const city = row.original.city;
                const country = row.original.country;

                if (!city && !country) {
                    return (
                        <span className="text-xs text-muted-foreground">N/A</span>
                    );
                }

                return (
                    <span className="text-sm">
                        {[city, country].filter(Boolean).join(', ')}
                    </span>
                );
            },
        },
        {
            accessorKey: 'is_active',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const isActive = row.getValue('is_active');

                return (
                    <Badge
                        variant={isActive ? 'default' : 'secondary'}
                        className={
                            isActive
                                ? 'border-green-500/20 bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                : ''
                        }
                    >
                        {isActive ? 'Active' : 'Inactive'}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'locations',
            header: 'Locations',
            cell: ({ row }) => {
                return (
                    <Link href={warehouses.show({ warehouse: row.original.id })}>
                        <Button variant="link">
                            {row.original.locations_count}
                        </Button>
                    </Link>
                );
            },
        },
        {
            accessorKey: 'created_by',
            header: 'Created By',
            cell: ({ row }) => {
                const creator = row.original.created_by?.name;

                return (
                    <span className="text-sm text-muted-foreground">
                        {creator || 'System'}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const warehouse = row.original;
                const canEdit =
                    auth?.user?.permissions?.includes('update_warehouses') ||
                    auth?.user?.roles?.includes('owner');
                const canDelete =
                    auth?.user?.permissions?.includes('delete_warehouses') ||
                    auth?.user?.roles?.includes('owner');

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link
                                    href={warehouses.show({
                                        warehouse: warehouse.id,
                                    })}
                                >
                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                </Link>
                            </DropdownMenuItem>
                            {canEdit && (
                                <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer"
                                >
                                    <Link
                                        href={warehouses.edit({
                                            warehouse: warehouse.id,
                                        })}
                                    >
                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            {canDelete && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground">
                                        <Trash className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}