import { Head } from '@inertiajs/react';
import items from '@/routes/items';
import ItemForm from './form';

export default function Create({ categories, brands, units }: { categories: any[]; brands: any[]; units: any[] }) {
    return (
        <>
            <Head title="Create Item" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold">Create Item</h1>
                </div>

                <div className="max-w-4xl rounded-xl border bg-card p-6 text-card-foreground">
                    <ItemForm categories={categories} brands={brands} units={units} />
                </div>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Items',
            href: items.index(),
        },
        {
            title: 'Create',
            href: items.create(),
        },
    ],
};
