import { Head } from '@inertiajs/react';
import categories from '@/routes/categories';
import CategoryForm from './form';

export default function Edit({ category }: { category: any }) {
    return (
        <>
            <Head title={`Edit Category - ${category.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold">Edit Category</h1>
                </div>

                <div className="max-w-2xl rounded-xl border bg-card p-6 text-card-foreground">
                    <CategoryForm category={category} />
                </div>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        {
            title: 'Categories',
            href: categories.index(),
        },
    ],
};
