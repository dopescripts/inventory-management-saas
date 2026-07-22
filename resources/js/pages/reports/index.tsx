import { Head, Link } from '@inertiajs/react';
import { Package, DollarSign, TrendingUp, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import * as reports from '@/routes/reports';
import React from 'react';

export default function Index() {
    const reportOptions = [
        {
            title: 'Inventory Report',
            description: 'View current stock volumes, item movements, and trackable status.',
            icon: Package,
            href: reports.inventory().url,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            title: 'Financial Report',
            description: 'Monitor your incoming bills, payments, and Accounts Payable/Receivable aging.',
            icon: DollarSign,
            href: reports.financial().url,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        {
            title: 'Sales Report',
            description: 'Analyze historical sales orders, revenue trends, and customer metrics.',
            icon: TrendingUp,
            href: reports.sales().url,
            color: 'text-rose-500',
            bg: 'bg-rose-500/10'
        },
        {
            title: 'Purchases Report',
            description: 'Review vendor reliability, purchase orders, and expenditure totals.',
            icon: Truck,
            href: reports.purchases().url,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10'
        }
    ];

    return (
        <>
            <Head title="Reports" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                    <p className="text-muted-foreground mt-2">
                        Export your business data, evaluate operational metrics, and review end-to-end trends.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {reportOptions.map((report) => (
                        <Link href={report.href} key={report.title} className="block transition-all hover:scale-[1.02]">
                            <Card className="h-full hover:border-primary/50">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className={`rounded-full p-3 ${report.bg} ${report.color}`}>
                                        <report.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <CardTitle>{report.title}</CardTitle>
                                        <CardDescription className="mt-1">{report.description}</CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Reports', href: reports.index() }
    ],
};
