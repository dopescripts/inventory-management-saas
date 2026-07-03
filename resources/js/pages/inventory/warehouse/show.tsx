import { Head, Link, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import warehouses from '@/routes/warehouses'
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash, Plus, MapPin, Activity, ArrowLeftRight, Info } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

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
}

const locationColumns: ColumnDef<Location>[] = [
    {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => <span className="font-medium">{row.getValue("code")}</span>
    },
    {
        accessorKey: "zone",
        header: "Zone",
    },
    {
        accessorKey: "aisle",
        header: "Aisle",
    },
    {
        accessorKey: "rack",
        header: "Rack",
    },
    {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => {
            const isActive = row.getValue("is_active");
            return (
                <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20" : ""}>
                    {isActive ? "Active" : "Inactive"}
                </Badge>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
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
                        <DropdownMenuItem className="text-destructive cursor-pointer">
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];

function Show({ warehouse }: { warehouse: Warehouse }) {
    const { url } = usePage();
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const tabParam = queryParams.get('tab') as any;
    const [activeTab, setActiveTab] = useState<'overview' | 'locations' | 'transfers' | 'activity'>(
        ['overview', 'locations', 'transfers', 'activity'].includes(tabParam) ? tabParam : 'overview'
    );

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Info },
        { id: 'locations', label: 'Locations', icon: MapPin },
        { id: 'transfers', label: 'Transfers', icon: ArrowLeftRight },
        { id: 'activity', label: 'Activity', icon: Activity },
    ] as const;

    return (
        <>
            <Head title={`Warehouse - ${warehouse.name}`} />

            <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6'>
                {/* Header section */}
                <div className='flex flex-col md:flex-row md:justify-between md:items-start gap-4'>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className='text-3xl font-bold'>{warehouse.name}</h1>
                            <Badge variant="outline" className="text-sm font-medium">
                                {warehouse.locations?.length || 0} Locations
                            </Badge>
                            <Badge variant={warehouse.is_active ? "default" : "secondary"} className={warehouse.is_active ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20" : ""}>
                                {warehouse.is_active ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1 flex items-center gap-2">
                            <span className="font-mono text-sm">{warehouse.code}</span>
                            •
                            <span>{[warehouse.city, warehouse.country].filter(Boolean).join(", ")}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={warehouses.edit({ warehouse: warehouse.id })}>
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
                                    className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 relative ${activeTab === tab.id
                                        ? 'text-foreground'
                                        : 'text-muted-foreground hover:text-foreground/80'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="mt-2">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                                <h3 className="font-semibold leading-none tracking-tight mb-2">Details</h3>
                                <dl className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Code</dt>
                                        <dd className="font-medium">{warehouse.code}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">City</dt>
                                        <dd className="font-medium">{warehouse.city || 'N/A'}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Country</dt>
                                        <dd className="font-medium">{warehouse.country || 'N/A'}</dd>
                                    </div>
                                </dl>
                            </div>
                            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                                <h3 className="font-semibold leading-none tracking-tight mb-2">Contact Details</h3>
                                <dl className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Contact Email</dt>
                                        <dd className="font-medium">{warehouse.email}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Phone</dt>
                                        <dd className="font-medium">{warehouse.phone}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    )}

                    {activeTab === 'locations' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold">Locations</h2>
                                <Button asChild>
                                    <Link href={warehouses.locations.create({ warehouse: warehouse.id })}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Location
                                    </Link>
                                </Button>
                            </div>
                            <div className="rounded-md border">
                                <DataTable columns={locationColumns} data={warehouse.locations || []} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'transfers' && (
                        <div className="text-center py-10 text-muted-foreground">
                            <ArrowLeftRight className="mx-auto h-12 w-12 opacity-20 mb-4" />
                            <p>Transfers functionality coming soon.</p>
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="text-center py-10 text-muted-foreground">
                            <Activity className="mx-auto h-12 w-12 opacity-20 mb-4" />
                            <p>Activity log coming soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

import AppLayout from '@/layouts/app-layout';

const ShowLayout = ({ children }: { children: React.ReactNode }) => {
    const { warehouse } = usePage<any>().props;
    return (
        <AppLayout breadcrumbs={[
            { title: 'Warehouses', href: warehouses.index() },
            { title: warehouse?.name || 'Details', href: warehouses.show({ warehouse: warehouse?.id }) }
        ]}>
            {children}
        </AppLayout>
    );
};

Show.layout = (page: React.ReactNode) => <ShowLayout>{page}</ShowLayout>;

export default Show;