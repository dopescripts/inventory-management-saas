import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Activity, MapPin } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import items from '@/routes/items';

interface Item {
    id: number;
    name: string;
    sku: string;
    barcode: string | null;
    type: string;
    track_inventory: boolean;
    is_active: boolean;
    category?: { name: string } | null;
    brand?: { name: string } | null;
    unit?: { name: string; short_name: string } | null;
    description: string | null;
}

interface StockLocation {
    location_id: number;
    total: number;
    location: {
        id: number;
        name: string;
        warehouse: { name: string };
    };
}

interface StockWarehouse {
    warehouse_id: number;
    total: number;
    warehouse: {
        id: number;
        name: string;
    };
}

interface InventoryMovement {
    id: number;
    direction: string;
    quantity: number;
    balance_after: number | null;
    notes: string | null;
    reference_type: string | null;
    reference_id: number | null;
    created_at: string;
    warehouse?: { name: string } | null;
    location?: { name: string } | null;
    performedBy?: { name: string } | null;
    performed_by?: { name: string } | null;
}

export default function Show({
    item,
    stockByLocation,
    stockByWarehouse,
    recentMovements,
    totalStock,
}: {
    item: Item;
    stockByLocation: StockLocation[];
    stockByWarehouse: StockWarehouse[];
    recentMovements: InventoryMovement[];
    totalStock: number;
}) {
    return (
        <>
            <Head title={`Item: ${item.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href={items.index()}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">{item.name}</h1>
                            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                SKU: {item.sku}
                                {item.barcode && (
                                    <>&bull; Barcode: {item.barcode}</>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href={items.edit({ item: item.id })}>
                                Edit Item
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Badge
                                    variant={
                                        item.is_active ? 'default' : 'secondary'
                                    }
                                >
                                    {item.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                                <Badge
                                    variant={
                                        item.track_inventory
                                            ? 'outline'
                                            : 'secondary'
                                    }
                                >
                                    {item.track_inventory
                                        ? 'Tracked'
                                        : 'Service'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Category & Brand
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-medium">
                                {item.category?.name ?? 'Uncategorized'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {item.brand?.name ?? 'No Brand'}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Stock
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {item.track_inventory
                                    ? Number(totalStock).toLocaleString()
                                    : 'N/A'}
                                <span className="ml-1 text-sm font-normal text-muted-foreground">
                                    {item.unit?.short_name}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {item.track_inventory && (
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Stock Locations
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1">
                                {stockByLocation.length === 0 &&
                                stockByWarehouse.length === 0 ? (
                                    <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed p-8 text-sm text-muted-foreground">
                                        No stock found in any location.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {stockByWarehouse.map((sw) => (
                                            <div
                                                key={`w-${sw.warehouse_id}`}
                                                className="flex items-center justify-between border-b pb-4 last:border-0"
                                            >
                                                <div>
                                                    <div className="font-medium">
                                                        {sw.warehouse?.name}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Warehouse default
                                                    </div>
                                                </div>
                                                <div className="text-lg font-semibold">
                                                    {Number(
                                                        sw.total,
                                                    ).toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                        {stockByLocation.map((sl) => (
                                            <div
                                                key={`l-${sl.location_id}`}
                                                className="flex items-center justify-between border-b pb-4 last:border-0"
                                            >
                                                <div>
                                                    <div className="font-medium">
                                                        {sl.location?.name}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {
                                                            sl.location
                                                                ?.warehouse
                                                                ?.name
                                                        }
                                                    </div>
                                                </div>
                                                <div className="text-lg font-semibold">
                                                    {Number(
                                                        sl.total,
                                                    ).toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 p-0">
                                {recentMovements.length === 0 ? (
                                    <div className="m-6 flex h-full items-center justify-center rounded-lg border-2 border-dashed p-8 text-sm text-muted-foreground">
                                        No recent movements.
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {recentMovements.map((movement) => {
                                            const performedBy =
                                                movement.performedBy ||
                                                movement.performed_by;

                                            return (
                                                <div
                                                    key={movement.id}
                                                    className="flex items-start justify-between p-4 hover:bg-muted/30"
                                                >
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Badge
                                                                variant={
                                                                    movement.direction ===
                                                                    'in'
                                                                        ? 'default'
                                                                        : 'destructive'
                                                                }
                                                                className="text-[10px] uppercase"
                                                            >
                                                                {
                                                                    movement.direction
                                                                }
                                                            </Badge>
                                                            <span className="text-sm font-medium">
                                                                {movement.reference_type
                                                                    ? `${movement.reference_type} #${movement.reference_id}`
                                                                    : 'Manual Adjustment'}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {new Date(
                                                                movement.created_at,
                                                            ).toLocaleString()}
                                                            {performedBy &&
                                                                ` • by ${performedBy.name}`}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {
                                                                movement
                                                                    .warehouse
                                                                    ?.name
                                                            }
                                                            {movement.location
                                                                ?.name &&
                                                                ` > ${movement.location.name}`}
                                                        </div>
                                                        {movement.notes && (
                                                            <div className="mt-1 text-xs text-muted-foreground italic">
                                                                "
                                                                {movement.notes}
                                                                "
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <div
                                                            className={`font-semibold ${movement.direction === 'in' ? 'text-green-600' : 'text-red-600'}`}
                                                        >
                                                            {movement.direction ===
                                                            'in'
                                                                ? '+'
                                                                : '-'}
                                                            {Number(
                                                                movement.quantity,
                                                            ).toLocaleString()}
                                                        </div>
                                                        {movement.balance_after !==
                                                            null && (
                                                            <div className="mt-1 text-xs text-muted-foreground">
                                                                Bal:{' '}
                                                                {Number(
                                                                    movement.balance_after,
                                                                ).toLocaleString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        {
            title: 'Items',
            href: items.index(),
        },
        {
            title: 'Item Details',
            href: '#',
        },
    ],
};
