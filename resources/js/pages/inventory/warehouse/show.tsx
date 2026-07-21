import { Head, Link, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    Edit,
    Trash,
    Plus,
    MapPin,
    Activity,
    ArrowLeftRight,
    Info,
    Box,
} from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';
import React, { useState } from 'react';
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
import AppLayout from '@/layouts/app-layout';
import transfers_routes from '@/routes/transfers';
import warehouses from '@/routes/warehouses';

interface Location {
    id: number;
    code: string;
    zone: string | null;
    aisle: string | null;
    rack: string | null;
    shelf: string | null;
    bin: string | null;
    description: string | null;
    email: string | null;
    phone: string | null;
    balance: number;
    is_active: boolean;
}

interface Warehouse {
    id: number;
    name: string;
    code: string;
    city: string;
    country: string;
    is_active: boolean;
    locations: Location[];
    locations_count: number;
    phone: string;
    email: string;
}

interface WarehouseTransfer {
    id: number;
    transfer_number: string;
    status: string;
    source_warehouse_id: number;
    destination_warehouse_id: number;
    source_warehouse: { id: number; name: string; code: string } | null;
    destination_warehouse: { id: number; name: string; code: string } | null;
    requested_by: { id: number; name: string } | null;
    items_count: number;
    requested_at: string | null;
}

const transferStatusLabels: Record<string, string> = {
    draft: 'Draft',
    pending_approval: 'Pending Approval',
    approved: 'Approved',
    processing: 'In Transit',
    complete: 'Received',
    cancelled: 'Cancelled',
};

const locationColumns: ColumnDef<Location>[] = [
    {
        accessorKey: 'code',
        header: 'Code',
        cell: ({ row }) => (
            <span className="font-medium">{row.getValue('code')}</span>
        ),
    },
    {
        accessorKey: 'zone',
        header: 'Zone',
    },
    {
        accessorKey: 'aisle',
        header: 'Aisle',
    },
    {
        accessorKey: 'rack',
        header: 'Rack',
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
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
        accessorKey: 'balance',
    },
    {
        id: 'actions',
        cell: () => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-destructive">
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const inventoryColumns: ColumnDef<any>[] = [
    {
        accessorKey: 'item.sku',
        header: 'SKU',
        cell: ({ row }) => (
            <span className="font-medium text-muted-foreground">
                {row.original.item.sku}
            </span>
        ),
    },
    {
        accessorKey: 'item.name',
        header: 'Item',
        cell: ({ row }) => (
            <span className="font-medium">{row.original.item.name}</span>
        ),
    },
    {
        accessorKey: 'location.code',
        header: 'Location',
        cell: ({ row }) => <span>{row.original.location?.code || '-'}</span>,
    },
    {
        accessorKey: 'balance',
        header: 'On Hand',
        cell: ({ row }) => (
            <span className="font-medium">
                {Number(row.getValue('balance'))}
            </span>
        ),
    },
];

function Show({
    warehouse,
    inventory = [],
    recentMovements = [],
    transfers = [],
}: {
    warehouse: Warehouse;
    inventory: any[];
    recentMovements: any[];
    transfers: WarehouseTransfer[];
}) {
    const { url } = usePage();
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const tabParam = queryParams.get('tab') as any;
    const [activeTab, setActiveTab] = useState<
        'overview' | 'locations' | 'transfers' | 'inventory' | 'activity'
    >(
        [
            'overview',
            'locations',
            'transfers',
            'inventory',
            'activity',
        ].includes(tabParam)
            ? tabParam
            : 'overview',
    );

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Info },
        { id: 'locations', label: 'Locations', icon: MapPin },
        { id: 'transfers', label: 'Transfers', icon: ArrowLeftRight },
        { id: 'inventory', label: 'Inventory', icon: Box },
        { id: 'activity', label: 'Activity', icon: Activity },
    ] as const;

    return (
        <>
            <Head title={`Warehouse - ${warehouse.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                {/* Header section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold">
                                {warehouse.name}
                            </h1>
                            <Badge
                                variant="outline"
                                className="text-sm font-medium"
                            >
                                {warehouse.locations?.length || 0} Locations
                            </Badge>
                            <Badge
                                variant={
                                    warehouse.is_active
                                        ? 'default'
                                        : 'secondary'
                                }
                                className={
                                    warehouse.is_active
                                        ? 'border-green-500/20 bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                        : ''
                                }
                            >
                                {warehouse.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                        <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                            <span className="font-mono text-sm">
                                {warehouse.code}
                            </span>
                            •
                            <span>
                                {[warehouse.city, warehouse.country]
                                    .filter(Boolean)
                                    .join(', ')}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link
                                href={warehouses.edit.url({
                                    warehouse: warehouse.id,
                                })}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Warehouse
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-border">
                    <div className="flex space-x-6">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? 'text-foreground'
                                            : 'text-muted-foreground hover:text-foreground/80'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute right-0 bottom-0 left-0 h-0.5 rounded-t-full bg-primary" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="mt-2">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                                <h3 className="mb-2 leading-none font-semibold tracking-tight">
                                    Details
                                </h3>
                                <dl className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Code
                                        </dt>
                                        <dd className="font-medium">
                                            {warehouse.code}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            City
                                        </dt>
                                        <dd className="font-medium">
                                            {warehouse.city || 'N/A'}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Country
                                        </dt>
                                        <dd className="font-medium">
                                            {warehouse.country || 'N/A'}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                            <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                                <h3 className="mb-2 leading-none font-semibold tracking-tight">
                                    Contact Details
                                </h3>
                                <dl className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Contact Email
                                        </dt>
                                        <dd className="font-medium">
                                            {warehouse.email}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Phone
                                        </dt>
                                        <dd className="font-medium">
                                            {warehouse.phone}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    )}

                    {activeTab === 'locations' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    Locations
                                </h2>
                                <Button asChild>
                                    <Link
                                        href={warehouses.locations.create.url({
                                            warehouse: warehouse.id,
                                        })}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Location
                                    </Link>
                                </Button>
                            </div>
                            <div className="rounded-md border">
                                <DataTable
                                    columns={locationColumns}
                                    data={warehouse.locations || []}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'inventory' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    Current Inventory
                                </h2>
                            </div>
                            <div className="rounded-md border">
                                <DataTable
                                    columns={inventoryColumns}
                                    data={inventory || []}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'transfers' && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Transfers</h2>
                            <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
                                {transfers?.length > 0 ? (
                                    <div className="divide-y">
                                        {transfers.map((transfer) => {
                                            const isOutbound =
                                                transfer.source_warehouse_id ===
                                                warehouse.id;
                                            const counterpart = isOutbound
                                                ? transfer.destination_warehouse
                                                : transfer.source_warehouse;

                                            return (
                                                <Link
                                                    key={transfer.id}
                                                    href={transfers_routes.show.url(
                                                        {
                                                            transfer:
                                                                transfer.id,
                                                        },
                                                    )}
                                                    className="flex items-start justify-between p-4 transition-colors hover:bg-muted/50"
                                                >
                                                    <div>
                                                        <p className="flex items-center gap-2 font-medium">
                                                            <span className="font-mono text-sm">
                                                                {
                                                                    transfer.transfer_number
                                                                }
                                                            </span>
                                                            <Badge
                                                                variant={
                                                                    isOutbound
                                                                        ? 'secondary'
                                                                        : 'default'
                                                                }
                                                                className={
                                                                    isOutbound
                                                                        ? ''
                                                                        : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                                                }
                                                            >
                                                                {isOutbound
                                                                    ? 'Outbound'
                                                                    : 'Inbound'}
                                                            </Badge>
                                                        </p>
                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            {isOutbound
                                                                ? 'To'
                                                                : 'From'}{' '}
                                                            {counterpart?.name ||
                                                                'N/A'}{' '}
                                                            •{' '}
                                                            {
                                                                transfer.items_count
                                                            }{' '}
                                                            item
                                                            {transfer.items_count ===
                                                            1
                                                                ? ''
                                                                : 's'}
                                                            {transfer.requested_at
                                                                ? ` • ${new Date(
                                                                      transfer.requested_at,
                                                                  ).toLocaleDateString()}`
                                                                : ''}
                                                        </p>
                                                    </div>
                                                    <Badge variant="outline">
                                                        {transferStatusLabels[
                                                            transfer.status
                                                        ] || transfer.status}
                                                    </Badge>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="py-10 text-center text-muted-foreground">
                                        <ArrowLeftRight className="mx-auto mb-4 h-12 w-12 opacity-20" />
                                        <p>
                                            No transfers involving this
                                            warehouse yet.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">
                                Recent Activity
                            </h2>
                            <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
                                {recentMovements?.length > 0 ? (
                                    <div className="divide-y">
                                        {recentMovements.map((movement) => {
                                            const isIncrease =
                                                movement.direction === 'in';

                                            return (
                                                <div
                                                    key={movement.id}
                                                    className="flex items-start justify-between p-4"
                                                >
                                                    <div>
                                                        <p className="font-medium">
                                                            {movement.reference_type
                                                                .replace(
                                                                    '_',
                                                                    ' ',
                                                                )
                                                                .replace(
                                                                    /\b\w/g,
                                                                    (
                                                                        c: string,
                                                                    ) =>
                                                                        c.toUpperCase(),
                                                                )}
                                                            <span className="ml-2 font-normal text-muted-foreground">
                                                                {
                                                                    movement
                                                                        .item
                                                                        .name
                                                                }{' '}
                                                                (
                                                                {
                                                                    movement
                                                                        .item
                                                                        .sku
                                                                }
                                                                )
                                                            </span>
                                                        </p>
                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            {new Date(
                                                                movement.created_at,
                                                            ).toLocaleString()}{' '}
                                                            • by{' '}
                                                            {movement
                                                                .performed_by
                                                                ?.name ||
                                                                'System'}
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            isIncrease
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                        className={
                                                            isIncrease
                                                                ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                                                : ''
                                                        }
                                                    >
                                                        {isIncrease ? '+' : '-'}
                                                        {Number(
                                                            movement.quantity,
                                                        )}
                                                    </Badge>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="py-10 text-center text-muted-foreground">
                                        <Activity className="mx-auto mb-4 h-12 w-12 opacity-20" />
                                        <p>No recent activity.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

const ShowLayout = ({ children }: { children: React.ReactNode }) => {
    const { warehouse } = usePage<any>().props;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Warehouses', href: warehouses.index.url() },
                {
                    title: warehouse?.name || 'Details',
                    href: warehouses.show.url({ warehouse: warehouse?.id }),
                },
            ]}
        >
            {children}
        </AppLayout>
    );
};

Show.layout = (page: React.ReactNode) => <ShowLayout>{page}</ShowLayout>;

export default Show;
