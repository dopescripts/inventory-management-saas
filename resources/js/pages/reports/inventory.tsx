import { Head } from '@inertiajs/react';
import { Download } from 'lucide-react';
import React from 'react';
import { InertiaPagination as Pagination } from '@/components/inertia-pagination';
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
import * as reports from '@/routes/reports';

interface Item {
    id: number;
    sku: string;
    name: string;
    track_inventory: boolean;
    is_active: boolean;
    inventory_movements_count: number;
}

interface Props {
    items: {
        data: Item[];
        links: any[];
        meta: any;
    };
}

export default function InventoryReport({ items }: Props) {
    const handleExport = () => {
        window.location.href = reports.inventory.export().url;
    };

    return (
        <>
            <Head title="Inventory Report" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Inventory Report
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Overview of current items and movement activity.
                        </p>
                    </div>
                    <Button onClick={handleExport} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Catalog Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Item Name</TableHead>
                                        <TableHead>Tracking</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Movements
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.data.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-mono text-muted-foreground">
                                                {item.sku || 'N/A'}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {item.name}
                                            </TableCell>
                                            <TableCell>
                                                {item.track_inventory
                                                    ? 'Yes'
                                                    : 'No'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        item.is_active
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {item.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {item.inventory_movements_count}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {items.data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="py-6 text-center text-muted-foreground"
                                            >
                                                No items found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="mt-4">
                            <Pagination links={items.links} meta={items.meta} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

InventoryReport.layout = {
    breadcrumbs: [
        { title: 'Reports', href: reports.index() },
        { title: 'Inventory', href: reports.inventory() },
    ],
};
