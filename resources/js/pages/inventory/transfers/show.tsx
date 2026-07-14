import React, { useState } from 'react';
import { Head, Link, usePage, router, useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import AppLayout from '@/layouts/app-layout';

import transfers from '@/routes/transfers';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import {
    ArrowRight,
    Edit,
    Package,
    Warehouse,
    Calendar,
    User,
} from 'lucide-react';
import { queryParams } from '@/wayfinder';
import warehouses from '@/routes/warehouses';

interface Warehouse {
    id: number;
    name: string;
}

interface Location {
    id: number;
    code: string;
}

interface UserModel {
    id: number;
    name: string;
}

interface TransferItem {
    id: number;

    quantity_requested: number;

    quantity_shipped: number | null;

    quantity_received: number | null;

    remarks: string | null;

    item: {
        id: number;
        sku: string;
        name: string;
    };
}

interface Transfer {

    id: number;

    transfer_number: string;

    status: string;

    notes: string | null;

    requested_at: string;

    approved_at: string | null;

    shipped_at: string | null;

    received_at: string | null;

    source_warehouse: Warehouse;

    destination_warehouse: Warehouse;

    source_location: Location | null;

    destination_location: Location | null;

    requested_by: UserModel;

    approved_by: UserModel | null;

    received_by: UserModel | null;

    items: TransferItem[];
}

interface Props {
    transfer: Transfer;
}

const statusVariant = (status: string) => {
    switch (status) {
        case 'draft':
            return 'secondary';
        case 'pending_approval':
            return 'outline';
        case 'approved':
            return 'default';
        case 'processing':
            return 'default';
        case 'complete':
            return 'default';
        case 'cancelled':
            return 'destructive';
        default:
            return 'secondary';
    }
};

function Show({
    transfer,
}: Props) {
    const [isShipModalOpen, setIsShipModalOpen] = useState(false);
    const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

    const shipForm = useForm({
        items: transfer.items.map(item => ({
            id: item.id,
            quantity: Math.max(0, item.quantity_requested - (item.quantity_shipped || 0)),
        }))
    });

    const receiveForm = useForm({
        items: transfer.items.map(item => ({
            id: item.id,
            quantity: Math.max(0, (item.quantity_shipped || 0) - (item.quantity_received || 0)),
        }))
    });

    const handleAction = (action: 'submit' | 'approve' | 'cancel') => {
        router.post(transfers[action]({ transfer: transfer.id }));
    };

    const submitShip = (e: React.FormEvent) => {
        e.preventDefault();
        shipForm.post(transfers.ship({ transfer: transfer.id }), {
            onSuccess: () => setIsShipModalOpen(false)
        });
    };

    const submitReceive = (e: React.FormEvent) => {
        e.preventDefault();
        receiveForm.post(transfers.receive({ transfer: transfer.id }), {
            onSuccess: () => setIsReceiveModalOpen(false)
        });
    };

    return (
        <>
            <Head
                title={transfer.transfer_number}
            />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">

                <div className="flex items-start justify-between">

                    <div>

                        <div className="flex items-center gap-3">

                            <h1 className="text-3xl font-bold">

                                {transfer.transfer_number}

                            </h1>

                            <Badge
                                variant={
                                    statusVariant(
                                        transfer.status
                                    ) as any
                                }
                            >
                                {transfer.status
                                    .replaceAll('_', ' ')
                                    .replace(/\b\w/g, c => c.toUpperCase())}
                            </Badge>

                        </div>

                        <p className="mt-2 text-muted-foreground">

                            Inventory Transfer

                        </p>

                    </div>

                    {transfer.status === 'draft' && (

                        <Button asChild>

                            <Link
                                href={transfers.edit({
                                    transfer: transfer.id,
                                })}
                            >
                                <Edit className="mr-2 h-4 w-4" />

                                Edit

                            </Link>

                        </Button>

                    )}

                </div>

                <div className="grid gap-4 lg:grid-cols-4">

                    <Card>

                        <CardHeader>

                            <CardTitle className="flex items-center gap-2">

                                <Warehouse className="h-4 w-4" />

                                Source

                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <div className="font-medium">

                                {transfer.source_warehouse.name}

                            </div>

                            {transfer.source_location && (

                                <div className="text-muted-foreground text-sm mt-1">

                                    {transfer.source_location.code}

                                </div>

                            )}

                        </CardContent>

                    </Card>

                    <Card>

                        <CardHeader>

                            <CardTitle className="flex items-center gap-2">

                                <ArrowRight className="h-4 w-4" />

                                Destination

                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <div className="font-medium">

                                {transfer.destination_warehouse.name}

                            </div>

                            {transfer.destination_location && (

                                <div className="text-muted-foreground text-sm mt-1">

                                    {transfer.destination_location.code}

                                </div>

                            )}

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

                                {transfer.items.length}

                            </div>

                        </CardContent>

                    </Card>

                    <Card>

                        <CardHeader>

                            <CardTitle className="flex items-center gap-2">

                                <User className="h-4 w-4" />

                                Requested By

                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <div>

                                {transfer.requested_by.name}

                            </div>

                            <div className="text-sm text-muted-foreground mt-1">

                                {new Date(
                                    transfer.requested_at
                                ).toLocaleString()}

                            </div>

                        </CardContent>

                    </Card>

                </div>
                <div className="grid gap-6 lg:grid-cols-3">

                    <Card className="lg:col-span-2">

                        <CardHeader>

                            <CardTitle>
                                Transfer Items
                            </CardTitle>

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
                                                Requested
                                            </th>

                                            <th className="px-4 py-3 text-right">
                                                Shipped
                                            </th>

                                            <th className="px-4 py-3 text-right">
                                                Received
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {transfer.items.map(item => (

                                            <tr
                                                key={item.id}
                                                className="border-b last:border-0"
                                            >

                                                <td className="px-4 py-3 font-mono text-muted-foreground">

                                                    {item.item.sku}

                                                </td>

                                                <td className="px-4 py-3 font-medium">

                                                    {item.item.name}

                                                </td>

                                                <td className="px-4 py-3 text-right">

                                                    {Number(item.quantity_requested)}

                                                </td>

                                                <td className="px-4 py-3 text-right">

                                                    {item.quantity_shipped === null
                                                        ? '-'
                                                        : Number(item.quantity_shipped)}

                                                </td>

                                                <td className="px-4 py-3 text-right">

                                                    {item.quantity_received === null
                                                        ? '-'
                                                        : Number(item.quantity_received)}

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </CardContent>

                    </Card>

                    <div className="space-y-6">

                        <Card>

                            <CardHeader>

                                <CardTitle>

                                    Notes

                                </CardTitle>

                            </CardHeader>

                            <CardContent>

                                {transfer.notes ? (

                                    <p className="whitespace-pre-wrap text-sm">

                                        {transfer.notes}

                                    </p>

                                ) : (

                                    <p className="text-sm text-muted-foreground">

                                        No notes provided.

                                    </p>

                                )}

                            </CardContent>

                        </Card>

                        <Card>

                            <CardHeader>

                                <CardTitle>

                                    Transfer Information

                                </CardTitle>

                            </CardHeader>

                            <CardContent className="space-y-4 text-sm">

                                <div className="flex justify-between">

                                    <span className="text-muted-foreground">

                                        Transfer #

                                    </span>

                                    <span className="font-medium">

                                        {transfer.transfer_number}

                                    </span>

                                </div>

                                <div className="flex justify-between">

                                    <span className="text-muted-foreground">

                                        Status

                                    </span>

                                    <Badge
                                        variant={
                                            statusVariant(
                                                transfer.status
                                            ) as any
                                        }
                                    >
                                        {transfer.status
                                            .replaceAll('_', ' ')
                                            .replace(/\b\w/g, c => c.toUpperCase())}
                                    </Badge>

                                </div>

                                <div className="flex justify-between">

                                    <span className="text-muted-foreground">

                                        Requested By

                                    </span>

                                    <span>

                                        {transfer.requested_by.name}

                                    </span>

                                </div>

                                {transfer.approved_by && (

                                    <div className="flex justify-between">

                                        <span className="text-muted-foreground">

                                            Approved By

                                        </span>

                                        <span>

                                            {transfer.approved_by.name}

                                        </span>

                                    </div>

                                )}

                                {transfer.received_by && (

                                    <div className="flex justify-between">

                                        <span className="text-muted-foreground">

                                            Received By

                                        </span>

                                        <span>

                                            {transfer.received_by.name}

                                        </span>

                                    </div>

                                )}

                            </CardContent>

                        </Card>

                    </div>

                </div>
                <div className="grid gap-6 lg:grid-cols-2">

                    <Card>

                        <CardHeader>

                            <CardTitle className="flex items-center gap-2">

                                <Calendar className="h-4 w-4" />

                                Timeline

                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <div className="space-y-5">

                                <div className="flex items-start justify-between">

                                    <div>
                                        <p className="font-medium">
                                            Requested
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            {transfer.requested_by.name}
                                        </p>
                                    </div>

                                    <div className="text-right text-sm text-muted-foreground">
                                        {new Date(
                                            transfer.requested_at
                                        ).toLocaleString()}
                                    </div>

                                </div>

                                {transfer.approved_at && (

                                    <div className="flex items-start justify-between">

                                        <div>

                                            <p className="font-medium">
                                                Approved
                                            </p>

                                            <p className="text-sm text-muted-foreground">
                                                {transfer.approved_by?.name}
                                            </p>

                                        </div>

                                        <div className="text-right text-sm text-muted-foreground">

                                            {new Date(
                                                transfer.approved_at
                                            ).toLocaleString()}

                                        </div>

                                    </div>

                                )}

                                {transfer.shipped_at && (

                                    <div className="flex items-start justify-between">

                                        <div>

                                            <p className="font-medium">
                                                Shipped
                                            </p>

                                        </div>

                                        <div className="text-right text-sm text-muted-foreground">

                                            {new Date(
                                                transfer.shipped_at
                                            ).toLocaleString()}

                                        </div>

                                    </div>

                                )}

                                {transfer.received_at && (

                                    <div className="flex items-start justify-between">

                                        <div>

                                            <p className="font-medium">
                                                Received
                                            </p>

                                            <p className="text-sm text-muted-foreground">
                                                {transfer.received_by?.name}
                                            </p>

                                        </div>

                                        <div className="text-right text-sm text-muted-foreground">

                                            {new Date(
                                                transfer.received_at
                                            ).toLocaleString()}

                                        </div>

                                    </div>

                                )}

                            </div>

                        </CardContent>

                    </Card>

                    <Card>

                        <CardHeader>

                            <CardTitle>

                                Actions

                            </CardTitle>

                        </CardHeader>

                        <CardContent className="space-y-3">
                            {transfer.status === 'draft' && (
                                <>
                                    <Button className="w-full" onClick={() => handleAction('submit')}>
                                        Submit For Approval
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => handleAction('cancel')}
                                    >
                                        Cancel Transfer
                                    </Button>
                                </>
                            )}

                            {transfer.status === 'pending_approval' && (
                                <>
                                    <Button className="w-full" onClick={() => handleAction('approve')}>
                                        Approve Transfer
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => handleAction('cancel')}
                                    >
                                        Cancel Transfer
                                    </Button>
                                </>
                            )}

                            {(transfer.status === 'approved' || transfer.status === 'processing') && transfer.items.some(i => (i.quantity_shipped || 0) < i.quantity_requested) && (
                                <Button className="w-full" onClick={() => setIsShipModalOpen(true)}>
                                    Ship Items
                                </Button>
                            )}

                            {transfer.status === 'processing' && transfer.items.some(i => (i.quantity_received || 0) < (i.quantity_shipped || 0)) && (
                                <Button className="w-full" onClick={() => setIsReceiveModalOpen(true)}>
                                    Receive Items
                                </Button>
                            )}

                            {transfer.status === 'complete' && (
                                <div className="rounded-md border bg-muted p-4 text-center text-sm text-muted-foreground">
                                    Transfer completed successfully.
                                </div>
                            )}

                            {transfer.status === 'cancelled' && (
                                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-center text-sm text-destructive">
                                    This transfer has been cancelled.
                                </div>
                            )}
                        </CardContent>

                    </Card>

                </div>

            </div>

            <Dialog open={isShipModalOpen} onOpenChange={setIsShipModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Ship Items</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitShip}>
                        <div className="grid gap-4 py-4">
                            {transfer.items.map((item, index) => {
                                const remaining = item.quantity_requested - (item.quantity_shipped || 0);
                                if (remaining <= 0) return null;
                                return (
                                    <div key={item.id} className="grid grid-cols-4 items-center gap-4">
                                        <Label className="col-span-1">{item.item.name}</Label>
                                        <div className="col-span-3 flex items-center gap-2">
                                            <Input
                                                type="number"
                                                step="0.0001"
                                                max={remaining}
                                                min="0"
                                                value={shipForm.data.items[index].quantity}
                                                onChange={(e) => {
                                                    const newItems = [...shipForm.data.items];
                                                    newItems[index].quantity = Number(e.target.value);
                                                    shipForm.setData('items', newItems);
                                                }}
                                            />
                                            <span className="text-sm text-muted-foreground shrink-0">
                                                / {remaining} remaining
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsShipModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={shipForm.processing}>Ship Selected</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isReceiveModalOpen} onOpenChange={setIsReceiveModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Receive Items</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitReceive}>
                        <div className="grid gap-4 py-4">
                            {transfer.items.map((item, index) => {
                                const remaining = (item.quantity_shipped || 0) - (item.quantity_received || 0);
                                if (remaining <= 0) return null;
                                return (
                                    <div key={item.id} className="grid grid-cols-4 items-center gap-4">
                                        <Label className="col-span-1">{item.item.name}</Label>
                                        <div className="col-span-3 flex items-center gap-2">
                                            <Input
                                                type="number"
                                                step="0.0001"
                                                max={remaining}
                                                min="0"
                                                value={receiveForm.data.items[index].quantity}
                                                onChange={(e) => {
                                                    const newItems = [...receiveForm.data.items];
                                                    newItems[index].quantity = Number(e.target.value);
                                                    receiveForm.setData('items', newItems);
                                                }}
                                            />
                                            <span className="text-sm text-muted-foreground shrink-0">
                                                / {remaining} remaining
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsReceiveModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={receiveForm.processing}>Receive Selected</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

const ShowLayout = ({ children }: { children: React.ReactNode }) => {
    const { transfer } = usePage<any>().props;
    return (
        <AppLayout breadcrumbs={[
            { title: 'Inventory', href: '' },
            { title: 'Transfers', href: transfers.index() },
            { title: '#' + transfer?.transfer_number || 'Details', href: '#' }
        ]}>
            {children}
        </AppLayout>
    );
};

Show.layout = (page: React.ReactNode) => <ShowLayout>{page}</ShowLayout>;

export default Show;