import { Head } from '@inertiajs/react';
import brands from '@/routes/brands';
import BrandForm from './form';

export default function Edit({ brand }: { brand: any }) {
    return (
        <>
            <Head title={`Edit Brand - ${brand.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold">Edit Brand</h1>
                </div>

                <div className="max-w-2xl rounded-xl border bg-card p-6 text-card-foreground">
                    <BrandForm brand={brand} />
                </div>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        {
            title: 'Brands',
            href: brands.index(),
        },
    ],
};
