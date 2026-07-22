import { Head } from '@inertiajs/react';
import { Download } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { InertiaPagination as Pagination } from '@/components/inertia-pagination';
import { useCurrency } from '@/lib/currency';
import * as reports from '@/routes/reports';

interface Order {
    id: number;
    purchase_number: string;
    total: number;
    status: string;
    expected_date: string | null;
    vendor?: {
        name: string;
    };
}

interface Props {
    orders: {
        data: Order[];
        links: any[];
        meta: any;
    };
}

export default function PurchasesReport({ orders }: Props) {
    const { format } = useCurrency();
    const handleExport = () => {
        window.location.href = reports.purchases.export().url;
    };

    return (
        <>
            <Head title="Purchases Report" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Purchases Report</h1>
                        <p className="text-muted-foreground mt-2">
                            Analyze purchase orders and vendor spending.
                        </p>
                    </div>
                    <Button onClick={handleExport} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Purchase Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>PO Number</TableHead>
                                        <TableHead>Vendor</TableHead>
                                        <TableHead>Expected Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.data.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">{order.purchase_number}</TableCell>
                                            <TableCell>{order.vendor?.name || 'N/A'}</TableCell>
                                            <TableCell>{order.expected_date ? new Date(order.expected_date).toLocaleDateString() : 'N/A'}</TableCell>
                                            <TableCell>
                                                <Badge variant={order.status === 'closed' ? 'default' : 'secondary'}>
                                                    {order.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-orange-600">{format(order.total)}</TableCell>
                                        </TableRow>
                                    ))}
                                    {orders.data.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                                No purchase orders found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="mt-4">
                            <Pagination links={orders.links} meta={orders.meta} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PurchasesReport.layout = {
    breadcrumbs: [
        { title: 'Reports', href: reports.index() },
        { title: 'Purchases', href: reports.purchases() },
    ],
};
