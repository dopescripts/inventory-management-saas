import { Head } from '@inertiajs/react';
import units from '@/routes/units';
import UnitForm from './form';

export default function Edit({ unit }: { unit: any }) {
    return (
        <>
            <Head title={`Edit Unit - ${unit.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold">Edit Unit</h1>
                </div>

                <div className="max-w-2xl rounded-xl border bg-card p-6 text-card-foreground">
                    <UnitForm unit={unit} />
                </div>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        {
            title: 'Units',
            href: units.index(),
        },
    ],
};
