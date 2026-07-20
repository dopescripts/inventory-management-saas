import { Head, Link, router, useForm } from '@inertiajs/react';
import { Edit, Package, ShoppingCart, Truck, User } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import purchases from '@/routes/purchases';
import { useCurrency } from '@/lib/currency';

interface Warehouse {
    id: number;
    name: string;
    locations: { id: number; code: string }[];
}

interface PurchaseItem {
    id: number;
    quantity_ordered: number;
    quantity_received: number;
    unit_cost: number;
    discount: number;
    tax: number;
    total: number;
    remarks: string | null;
    item: {
        id: number;
        sku: string;
        name: string;
    };
}

interface PurchaseOrder {
    id: number;
    purchase_number: string;
    status: string;
    notes: string | null;
    expected_date: string | null;
    subtotal: number;
    discount: number;
    tax: number;
    shipping: number;
    total: number;
    approved_at: string | null;
    created_at: string;
    vendor: { id: number; name: string };
    ordered_by: { id: number; name: string };
    approved_by: { id: number; name: string } | null;
    items: PurchaseItem[];
}

interface Props {
    purchaseOrder: PurchaseOrder;
    warehouses: Warehouse[];
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
            return 'default';
        case 'cancelled':
            return 'destructive';
        default:
            return 'secondary';
    }
};

export default function Show({ purchaseOrder, warehouses }: Props) {
    const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

    const receiveForm = useForm({
        warehouse_id: '',
        items: purchaseOrder.items.map((item) => ({
            purchase_order_item_id: item.id,
            item_id: item.item.id,
            quantity: Math.max(
                0,
                item.quantity_ordered - item.quantity_received,
            ),
            unit_cost: item.unit_cost,
            location_id: '',
        })),
    });

    const handleAction = (
        action: 'submit' | 'approve' | 'cancel' | 'close',
    ) => {
        router.post(purchases[action]({ purchase_order: purchaseOrder.id }));
    };

    const submitReceive = (e: React.FormEvent) => {
        e.preventDefault();

        receiveForm.post(
            purchases.receive({ purchase_order: purchaseOrder.id }),
            {
                onSuccess: () => setIsReceiveModalOpen(false),
            },
        );
    };

    const selectedWarehouse = warehouses?.find(
        (w) => w.id.toString() === receiveForm.data.warehouse_id,
    );

    const { format } = useCurrency();

    return (
        <>
            <Head title={purchaseOrder.purchase_number} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold">
                                {purchaseOrder.purchase_number}
                            </h1>
                            <Badge
                                variant={
                                    statusVariant(purchaseOrder.status) as any
                                }
                            >
                                {purchaseOrder.status
                                    .replaceAll('_', ' ')
                                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </Badge>
                        </div>
                        <p className="mt-2 text-muted-foreground">
                            Purchase Order from {purchaseOrder.vendor.name}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {purchaseOrder.status === 'draft' && (
                            <>
                                <Button asChild variant="outline">
                                    <Link
                                        href={purchases.edit({
                                            purchase_order: purchaseOrder.id,
                                        })}
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </Button>
                                <Button onClick={() => handleAction('submit')}>
                                    Submit for Approval
                                </Button>
                            </>
                        )}

                        {purchaseOrder.status === 'pending_approval' && (
                            <>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleAction('cancel')}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={() => handleAction('approve')}>
                                    Approve
                                </Button>
                            </>
                        )}

                        {(purchaseOrder.status === 'approved' ||
                            purchaseOrder.status === 'partially_received') && (
                            <>
                                {purchaseOrder.status === 'approved' && (
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleAction('cancel')}
                                    >
                                        Cancel
                                    </Button>
                                )}
                                <Button
                                    onClick={() => setIsReceiveModalOpen(true)}
                                >
                                    <Package className="mr-2 h-4 w-4" />
                                    Receive Goods
                                </Button>
                            </>
                        )}

                        {purchaseOrder.status === 'received' && (
                            <Button onClick={() => handleAction('close')}>
                                Close Order
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-4 w-4" />
                                Vendor
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="font-medium">
                                {purchaseOrder.vendor.name}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4" />
                                Total
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {format(purchaseOrder.total)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {purchaseOrder.items.length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Ordered By
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>{purchaseOrder.ordered_by.name}</div>
                            <div className="mt-1 text-sm text-muted-foreground">
                                {new Date(
                                    purchaseOrder.created_at,
                                ).toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-left">
                                            SKU
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            Item
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            Ordered
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            Received
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            Unit Cost
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchaseOrder.items.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="px-4 py-3 font-mono text-muted-foreground">
                                                {item.item.sku}
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.item.name}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {item.quantity_ordered}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {item.quantity_received}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {format(item.unit_cost)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium">
                                                {format(item.total)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t">
                                        <td
                                            colSpan={5}
                                            className="px-4 py-2 text-right font-medium"
                                        >
                                            Subtotal
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            {format(purchaseOrder.subtotal)}
                                        </td>
                                    </tr>
                                    {Number(purchaseOrder.discount) > 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-4 py-2 text-right font-medium"
                                            >
                                                Discount
                                            </td>
                                            <td className="px-4 py-2 text-right text-destructive">
                                                -
                                                {format(purchaseOrder.discount)}
                                            </td>
                                        </tr>
                                    )}
                                    {Number(purchaseOrder.tax) > 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-4 py-2 text-right font-medium"
                                            >
                                                Tax
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                {format(purchaseOrder.tax)}
                                            </td>
                                        </tr>
                                    )}
                                    {Number(purchaseOrder.shipping) > 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-4 py-2 text-right font-medium"
                                            >
                                                Shipping
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                {format(purchaseOrder.shipping)}
                                            </td>
                                        </tr>
                                    )}
                                    <tr className="border-t font-bold">
                                        <td
                                            colSpan={5}
                                            className="px-4 py-3 text-right"
                                        >
                                            Total
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {format(purchaseOrder.total)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {purchaseOrder.notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {purchaseOrder.notes}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <Dialog
                open={isReceiveModalOpen}
                onOpenChange={setIsReceiveModalOpen}
            >
                <DialogContent className="max-w-3xl!">
                    <DialogHeader>
                        <DialogTitle>Receive Goods</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={submitReceive} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Warehouse</Label>
                                <Select
                                    value={receiveForm.data.warehouse_id}
                                    onValueChange={(value) =>
                                        receiveForm.setData(
                                            'warehouse_id',
                                            value,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select warehouse" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {warehouses?.map((wh) => (
                                            <SelectItem
                                                key={wh.id}
                                                value={wh.id.toString()}
                                            >
                                                {wh.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-2 text-left">
                                            Item
                                        </th>
                                        <th className="px-4 py-2 text-right">
                                            Ordered
                                        </th>
                                        <th className="px-4 py-2 text-right">
                                            Already Received
                                        </th>
                                        <th className="px-4 py-2 text-right">
                                            Remaining
                                        </th>
                                        <th className="px-4 py-2 text-right">
                                            Receive Now
                                        </th>
                                        <th className="px-4 py-2 text-left">
                                            Location
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchaseOrder.items.map((item, index) => {
                                        const remaining =
                                            item.quantity_ordered -
                                            item.quantity_received;

                                        if (remaining <= 0) {
                                            return null;
                                        }

                                        return (
                                            <tr
                                                key={item.id}
                                                className="border-b"
                                            >
                                                <td className="px-4 py-2">
                                                    <div className="font-medium">
                                                        {item.item.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {item.item.sku}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    {item.quantity_ordered}
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    {item.quantity_received}
                                                </td>
                                                <td className="px-4 py-2 text-right font-medium">
                                                    {remaining}
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    <Input
                                                        type="number"
                                                        className="ml-auto w-24"
                                                        min={0}
                                                        max={remaining}
                                                        value={
                                                            receiveForm.data
                                                                .items[index]
                                                                ?.quantity ?? 0
                                                        }
                                                        onChange={(e) => {
                                                            const items = [
                                                                ...receiveForm
                                                                    .data.items,
                                                            ];
                                                            items[index] = {
                                                                ...items[index],
                                                                quantity:
                                                                    Number(
                                                                        e.target
                                                                            .value,
                                                                    ),
                                                            };
                                                            receiveForm.setData(
                                                                'items',
                                                                items,
                                                            );
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    {selectedWarehouse
                                                        ?.locations?.length ? (
                                                        <Select
                                                            value={
                                                                receiveForm.data
                                                                    .items[
                                                                    index
                                                                ]
                                                                    ?.location_id ??
                                                                ''
                                                            }
                                                            onValueChange={(
                                                                value,
                                                            ) => {
                                                                const items = [
                                                                    ...receiveForm
                                                                        .data
                                                                        .items,
                                                                ];
                                                                items[index] = {
                                                                    ...items[
                                                                        index
                                                                    ],
                                                                    location_id:
                                                                        value,
                                                                };
                                                                receiveForm.setData(
                                                                    'items',
                                                                    items,
                                                                );
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-32">
                                                                <SelectValue placeholder="Optional" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {selectedWarehouse.locations.map(
                                                                    (loc) => (
                                                                        <SelectItem
                                                                            key={
                                                                                loc.id
                                                                            }
                                                                            value={loc.id.toString()}
                                                                        >
                                                                            {
                                                                                loc.code
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsReceiveModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    receiveForm.processing ||
                                    !receiveForm.data.warehouse_id
                                }
                            >
                                Confirm Receipt
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Purchasing', href: '' },
        { title: 'Purchase Orders', href: purchases.index() },
        { title: 'Details', href: '' },
    ],
};
