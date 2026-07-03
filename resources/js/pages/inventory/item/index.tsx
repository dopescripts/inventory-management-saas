import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import items from '@/routes/items';
import { Edit, Trash2 } from 'lucide-react';

type Item = {
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
};

export default function Index({ items: paginatedItems }: { items: { data: Item[] } }) {
    return (
        <>
            <Head title="Items" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold">Items</h1>
                    <Button asChild>
                        <Link href={items.create()}>Add Item</Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card text-card-foreground">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-muted/50 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">SKU</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Brand</th>
                                <th className="px-6 py-3">Unit</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedItems.data.map((item) => (
                                <tr key={item.id} className="border-b last:border-0 hover:bg-muted/50">
                                    <td className="px-6 py-4 font-medium">{item.name}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{item.sku}</td>
                                    <td className="px-6 py-4">{item.category?.name ?? 'None'}</td>
                                    <td className="px-6 py-4">{item.brand?.name ?? 'None'}</td>
                                    <td className="px-6 py-4">{item.unit ? `${item.unit.name} (${item.unit.short_name})` : 'None'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant={item.is_active ? 'default' : 'secondary'}>{item.is_active ? 'Active' : 'Inactive'}</Badge>
                                            <Badge variant={item.track_inventory ? 'outline' : 'secondary'}>{item.track_inventory ? 'Tracked' : 'Service'}</Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={items.edit({ item: item.id })}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => {
                                                    if (confirm('Delete this item?')) {
                                                        router.delete(items.destroy({ item: item.id }).url());
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Items',
            href: items.index(),
        },
    ],
};
