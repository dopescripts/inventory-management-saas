import { Head, Link, usePage } from '@inertiajs/react'
import React from 'react'
import warehouses from '@/routes/warehouses'
import { Button } from '@/components/ui/button';
import { columns } from "./columns";
import { DataTable } from '@/components/ui/data-table';
import { InertiaPagination } from '@/components/inertia-pagination';
interface PaginatedWarehouses {
    data: any[]
    links: Array<{ url: string | null; label: string; active: boolean }>
}

function index({ warehousesData }: { warehousesData: PaginatedWarehouses }) {
    const auth = usePage().props.auth;
    const data = warehousesData;
    console.log(data);
    return (
        <>
            <Head title="Warehouses" />
            <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
                <div className='flex justify-between items-center mb-6'>
                    <h1 className='text-2xl font-bold'>Warehouses</h1>
                    {
                        (auth?.user?.permissions?.includes('create_warehouses') || auth?.user?.roles?.includes('manager')) && (
                            <Button asChild>
                                <Link href={warehouses.create()}>Create Warehouse</Link>
                            </Button>
                        )
                    }
                </div>
                <DataTable columns={columns} data={data.data} />
                <InertiaPagination links={data.links} />
            </div>
        </>

    )
}
index.layout = {
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

export default index