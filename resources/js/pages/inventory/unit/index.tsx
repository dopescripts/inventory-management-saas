import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import units from '@/routes/units';

type Unit = {
    id: number;
    name: string;
    short_name: string;
    type: string;
    is_active: boolean;
};

export default function Index({
    units: paginatedUnits,
}: {
    units: { data: Unit[] };
}) {
    return (
        <>
            <Head title="Units" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold">Units of Measure</h1>
                    <Button asChild>
                        <Link href={units.create()}>Add Unit</Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card text-card-foreground">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-muted/50 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Short Name</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUnits.data.map((unit) => (
                                <tr
                                    key={unit.id}
                                    className="border-b last:border-0 hover:bg-muted/50"
                                >
                                    <td className="px-6 py-4 font-medium">
                                        {unit.name}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs">
                                        {unit.short_name}
                                    </td>
                                    <td className="px-6 py-4">{unit.type}</td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            variant={
                                                unit.is_active
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {unit.is_active
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
                                                    href={units.edit({
                                                        unit: unit.id,
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
                                                            'Delete this unit?',
                                                        )
                                                    ) {
                                                        router.delete(
                                                            units
                                                                .destroy({
                                                                    unit: unit.id,
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
            title: 'Units',
            href: units.index(),
        },
    ],
};
