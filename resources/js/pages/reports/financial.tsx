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

interface Bill {
    id: number;
    bill_number: string;
    total: number;
    paid_amount: number;
    status: string;
    due_date: string | null;
    issued_at: string;
}

interface Props {
    bills: {
        data: Bill[];
        links: any[];
        meta: any;
    };
}

export default function FinancialReport({ bills }: Props) {
    const { format } = useCurrency();
    const handleExport = () => {
        window.location.href = reports.financial.export().url;
    };

    return (
        <>
            <Head title="Financial Report" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Financial Report</h1>
                        <p className="text-muted-foreground mt-2">
                            Overview of purchase bills, payments, and AP aging.
                        </p>
                    </div>
                    <Button onClick={handleExport} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Accounts Payable</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Bill Number</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="text-right">Paid</TableHead>
                                        <TableHead className="text-right">Balance</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bills.data.map((bill) => {
                                        const balance = bill.total - bill.paid_amount;
                                        return (
                                            <TableRow key={bill.id}>
                                                <TableCell className="font-medium">{bill.bill_number}</TableCell>
                                                <TableCell>
                                                    <Badge variant={bill.status === 'paid' ? 'default' : 'secondary'}>
                                                        {bill.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{bill.due_date ? new Date(bill.due_date).toLocaleDateString() : 'N/A'}</TableCell>
                                                <TableCell className="text-right">{format(bill.total)}</TableCell>
                                                <TableCell className="text-right">{format(bill.paid_amount)}</TableCell>
                                                <TableCell className="text-right font-medium text-rose-600">{format(balance)}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {bills.data.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                                No bills found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="mt-4">
                            <Pagination links={bills.links} meta={bills.meta} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

FinancialReport.layout = {
    breadcrumbs: [
        { title: 'Reports', href: reports.index() },
        { title: 'Financial', href: reports.financial() },
    ],
};
