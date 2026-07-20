import { Head, Link, router, setLayoutProps } from '@inertiajs/react';
import {
    Building2,
    CheckCircle,
    Edit,
    Package,
    Trash,
    XCircle,
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useCurrency } from '@/lib/currency';
import orders from '@/routes/orders';

interface SalesOrderItem {
    id: number;
    item: { id: number; name: string; sku: string | null };
    ordered_quantity: string | number;
    picked_quantity: string | number;
    shipped_quantity: string | number;
    unit_price: string | number;
    total: string | number;
}

interface SalesOrder {
    id: number;
    number: string;
    status: string;
    order_date: string;
    expected_ship_date: string | null;
    customer: { id: number; name: string; email: string | null } | null;
    warehouse: { id: number; name: string } | null;
    subtotal: string | number;
    discount: string | number;
    tax: string | number;
    shipping: string | number;
    total: string | number;
    notes: string | null;
    items: SalesOrderItem[];
}

interface Props {
    salesOrder: SalesOrder;
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

export default function Show({ salesOrder }: Props) {
    const { format } = useCurrency();

    setLayoutProps({
        breadcrumbs: [
            { title: 'Sales', href: '' },
            { title: 'Orders', href: orders.index() },
            {
                title: salesOrder.number,
                href: orders.show({ order: salesOrder.id }),
            },
        ],
    });

    const handleConfirm = () => {
        if (window.confirm(`Confirm order ${salesOrder.number}?`)) {
            router.post(orders.confirm({ order: salesOrder.id }).url);
        }
    };

    const handleCancel = () => {
        if (
            window.confirm(
                `Cancel order ${salesOrder.number}? This cannot be undone.`,
            )
        ) {
            router.post(orders.cancel({ order: salesOrder.id }).url);
        }
    };

    const handleDelete = () => {
        if (window.confirm('Delete this draft order? This cannot be undone.')) {
            router.delete(orders.destroy({ order: salesOrder.id }).url);
        }
    };

    return (
        <>
            <Head title={salesOrder.number} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold">
                                {salesOrder.number}
                            </h1>
                            <Badge variant={statusVariant(salesOrder.status)}>
                                {salesOrder.status
                                    .replace(/_/g, ' ')
                                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </Badge>
                        </div>
                        <p className="mt-1 text-muted-foreground">
                            Ordered on{' '}
                            {new Date(
                                salesOrder.order_date,
                            ).toLocaleDateString()}
                            {salesOrder.expected_ship_date && (
                                <>
                                    {' '}
                                    · Ships by{' '}
                                    {new Date(
                                        salesOrder.expected_ship_date,
                                    ).toLocaleDateString()}
                                </>
                            )}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {salesOrder.status === 'draft' && (
                            <>
                                <Button variant="outline" asChild>
                                    <Link
                                        href={
                                            orders.edit({
                                                order: salesOrder.id,
                                            }).url
                                        }
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </Button>
                                <Button onClick={handleConfirm}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Confirm Order
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </>
                        )}
                        {salesOrder.status === 'confirmed' && (
                            <Button
                                variant="destructive"
                                onClick={handleCancel}
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Order
                            </Button>
                        )}
                    </div>
                </div>

                {/* Meta cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Customer
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-semibold">
                                {salesOrder.customer?.name ?? '—'}
                            </p>
                            {salesOrder.customer?.email && (
                                <p className="text-sm text-muted-foreground">
                                    {salesOrder.customer.email}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Warehouse
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="flex items-center gap-2 font-semibold">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                {salesOrder.warehouse?.name ?? '—'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Order Total
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                {format(salesOrder.total)}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Line Items */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Line Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-right">
                                        Ordered
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Picked
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Shipped
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Unit Price
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Total
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {salesOrder.items.map((lineItem) => (
                                    <TableRow key={lineItem.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {lineItem.item.name}
                                                </p>
                                                {lineItem.item.sku && (
                                                    <p className="text-sm text-muted-foreground">
                                                        SKU: {lineItem.item.sku}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {lineItem.ordered_quantity}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {lineItem.picked_quantity}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {lineItem.shipped_quantity}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {format(lineItem.unit_price)}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {format(lineItem.total)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Totals */}
                        <div className="mt-4 flex justify-end">
                            <div className="w-64 space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Subtotal
                                    </span>
                                    <span>{format(salesOrder.subtotal)}</span>
                                </div>
                                {parseFloat(salesOrder.discount as string) >
                                    0 && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Discount
                                        </span>
                                        <span>
                                            -{format(salesOrder.discount)}
                                        </span>
                                    </div>
                                )}
                                {parseFloat(salesOrder.tax as string) > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Tax
                                        </span>
                                        <span>{format(salesOrder.tax)}</span>
                                    </div>
                                )}
                                {parseFloat(salesOrder.shipping as string) >
                                    0 && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Shipping
                                        </span>
                                        <span>
                                            {format(salesOrder.shipping)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between border-t pt-1 font-semibold">
                                    <span>Total</span>
                                    <span>{format(salesOrder.total)}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notes */}
                {salesOrder.notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm whitespace-pre-wrap">
                                {salesOrder.notes}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}
