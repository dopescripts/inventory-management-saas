import { Head } from '@inertiajs/react';
import brands from '@/routes/brands';
import BrandForm from './form';

export default function Create() {
    return (
        <>
            <Head title="Create Brand" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold">Create Brand</h1>
                </div>

                <div className="max-w-2xl rounded-xl border bg-card p-6 text-card-foreground">
                    <BrandForm />
                </div>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Brands',
            href: brands.index(),
        },
        {
            title: 'Create',
            href: brands.create(),
        },
    ],
};
