import { Head, Link, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { InertiaPagination } from '@/components/inertia-pagination';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import warehouses from '@/routes/warehouses';
import { getColumns } from './columns';
interface PaginatedWarehouses {
    data: any[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

function Index({ warehousesData }: { warehousesData: PaginatedWarehouses }) {
     
    const auth = usePage().props.auth;
    const data = warehousesData;
    const columns = useMemo(() => getColumns(auth), [auth]);

    return (
        <>
            <Head title="Warehouses" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Warehouses</h1>
                    {(auth?.user?.permissions?.includes('create_warehouses') ||
                        auth?.user?.roles?.includes('manager')) && (
                        <Button asChild>
                            <Link href={warehouses.create()}>
                                Create Warehouse
                            </Link>
                        </Button>
                    )}
                </div>
                <DataTable columns={columns} data={data.data} />
                <InertiaPagination links={data.links} />
            </div>
        </>
    );
}
Index.layout = {
    breadcrumbs: [
        {
            title: 'Inventory',
            href: '',
        },
        {
            title: 'Warehouses',
            href: warehouses.index(),
        },
    ],
};

export default Index;
