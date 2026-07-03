import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import categories from '@/routes/categories';
import { Edit, Plus, Trash2 } from 'lucide-react';

type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    items_count: number;
};

export default function Index({ categories: paginatedCategories }: { categories: { data: Category[] } }) {
    return (
        <>
            <Head title="Categories" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <Button asChild>
                        <Link href={categories.create()}>Add Category</Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card text-card-foreground">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-muted/50 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Slug</th>
                                <th className="px-6 py-3">Items</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCategories.data.map((category) => (
                                <tr key={category.id} className="border-b last:border-0 hover:bg-muted/50">
                                    <td className="px-6 py-4 font-medium">{category.name}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{category.slug}</td>
                                    <td className="px-6 py-4">{category.items_count}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={category.is_active ? 'default' : 'secondary'}>{category.is_active ? 'Active' : 'Inactive'}</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={categories.edit({ category: category.id })}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => {
                                                    if (confirm('Delete this category?')) {
                                                        router.delete(categories.destroy({ category: category.id }).url());
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
            title: 'Categories',
            href: categories.index(),
        },
    ],
};
