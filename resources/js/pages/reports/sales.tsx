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
    number: string;
    total: number;
    status: string;
    order_date: string | null;
    customer?: {
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

export default function SalesReport({ orders }: Props) {
    const { format } = useCurrency();
    const handleExport = () => {
        window.location.href = reports.sales.export().url;
    };

    return (
        <>
            <Head title="Sales Report" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Sales Report</h1>
                        <p className="text-muted-foreground mt-2">
                            Review historical sales orders and revenue.
                        </p>
                    </div>
                    <Button onClick={handleExport} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Sales Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order Number</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.data.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">{order.number}</TableCell>
                                            <TableCell>{order.customer?.name || 'N/A'}</TableCell>
                                            <TableCell>{order.order_date ? new Date(order.order_date).toLocaleDateString() : 'N/A'}</TableCell>
                                            <TableCell>
                                                <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                                                    {order.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-green-600">{format(order.total)}</TableCell>
                                        </TableRow>
                                    ))}
                                    {orders.data.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                                No sales orders found.
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

SalesReport.layout = {
    breadcrumbs: [
        { title: 'Reports', href: reports.index() },
        { title: 'Sales', href: reports.sales() },
    ],
};
