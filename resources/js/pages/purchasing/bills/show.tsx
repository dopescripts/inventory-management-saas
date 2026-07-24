import { Head, router } from '@inertiajs/react';
import { Download, FileText, Package, Truck, User } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrency } from '@/lib/currency';
import bills from '@/routes/bills';

interface BillItem {
    id: number;
    description: string | null;
    quantity: number;
    unit_cost: number;
    discount: number;
    tax: number;
    total: number;
    item: { id: number; sku: string; name: string };
}

interface PurchaseBill {
    id: number;
    bill_number: string;
    status: string;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    paid_amount: number;
    due_date: string | null;
    issued_at: string | null;
    notes: string | null;
    created_at: string;
    purchase_order: {
        id: number;
        purchase_number: string;
        vendor: { id: number; name: string };
    } | null;
    purchase_receive: { id: number; received_at: string } | null;
    currency: {
        id: number;
        code: string;
        symbol: string;
        decimal_places: number;
    } | null;
    created_by: { id: number; name: string };
    items: BillItem[];
}

interface Props {
    bill: PurchaseBill;
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

export default function Show({ bill }: Props) {
    const { format } = useCurrency();

    const outstanding = Number(bill.total) - Number(bill.paid_amount);

    return (
        <>
            <Head title={bill.bill_number} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold">
                                {bill.bill_number}
                            </h1>
                            <Badge variant={statusVariant(bill.status) as any}>
                                {bill.status
                                    .replaceAll('_', ' ')
                                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </Badge>
                        </div>
                        {bill.purchase_order && (
                            <p className="mt-2 text-muted-foreground">
                                Bill for PO{' '}
                                {bill.purchase_order?.purchase_number}
                                {bill.purchase_order?.vendor && ` from ${bill.purchase_order?.vendor.name}`}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <a
                                href={bills.download({ bill: bill.id }).url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </a>
                        </Button>

                        {(bill.status === 'draft' ||
                            bill.status === 'pending') && (
                                <Button
                                    onClick={() =>
                                        router.post(
                                            bills.markPaid({ bill: bill.id }),
                                        )
                                    }
                                >
                                    Mark as Paid
                                </Button>
                            )}

                        {bill.status === 'draft' && (
                            <Button
                                variant="destructive"
                                onClick={() =>
                                    router.post(bills.cancel({ bill: bill.id }))
                                }
                            >
                                Cancel
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
                                {bill.purchase_order?.vendor?.name ?? '—'}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Total
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {format(bill.total)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Outstanding
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {format(outstanding)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Created By
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>{bill.created_by.name}</div>
                            <div className="mt-1 text-sm text-muted-foreground">
                                {bill.issued_at
                                    ? new Date(
                                        bill.issued_at,
                                    ).toLocaleDateString()
                                    : new Date(
                                        bill.created_at,
                                    ).toLocaleDateString()}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Bill Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-left">
                                            Item
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            Qty
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            Unit Cost
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            Discount
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            Tax
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bill.items.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="font-medium">
                                                    {item.description ||
                                                        item.item.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {item.item.sku}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {item.quantity}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {format(item.unit_cost)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {format(item.discount)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {format(item.tax)}
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
                                            {format(bill.subtotal)}
                                        </td>
                                    </tr>
                                    {Number(bill.discount) > 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-4 py-2 text-right text-muted-foreground"
                                            >
                                                Discount
                                            </td>
                                            <td className="px-4 py-2 text-right text-muted-foreground">
                                                -{format(bill.discount)}
                                            </td>
                                        </tr>
                                    )}
                                    {Number(bill.tax) > 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-4 py-2 text-right text-muted-foreground"
                                            >
                                                Tax
                                            </td>
                                            <td className="px-4 py-2 text-right text-muted-foreground">
                                                {format(bill.tax)}
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
                                            {format(bill.total)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {bill.notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {bill.notes}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Purchasing', href: '' },
        { title: 'Bills', href: bills.index() },
        { title: 'Details', href: '' },
    ],
};
