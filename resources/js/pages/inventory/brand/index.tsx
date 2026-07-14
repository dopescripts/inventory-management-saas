import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import brands from '@/routes/brands';

type Brand = {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    items_count: number;
};

export default function Index({
    brands: paginatedBrands,
}: {
    brands: { data: Brand[] };
}) {
    return (
        <>
            <Head title="Brands" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold">Brands</h1>
                    <Button asChild>
                        <Link href={brands.create()}>Add Brand</Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card text-card-foreground">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-muted/50 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Items</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedBrands.data.map((brand) => (
                                <tr
                                    key={brand.id}
                                    className="border-b last:border-0 hover:bg-muted/50"
                                >
                                    <td className="px-6 py-4 font-medium">
                                        {brand.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {brand.items_count}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            variant={
                                                brand.is_active
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {brand.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                asChild
                                            >
                                                <Link
                                                    href={brands.edit({
                                                        brand: brand.id,
                                                    })}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            'Delete this brand?',
                                                        )
                                                    ) {
                                                        router.delete(
                                                            brands
                                                                .destroy({
                                                                    brand: brand.id,
                                                                })
                                                                .url(),
                                                        );
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
            title: 'Brands',
            href: brands.index(),
        },
    ],
};
