import { Head, Link, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import staffRoute from '@/routes/staff';

export default function Index({ staff }: { staff: any[] }) {
    const authUser = usePage().props.auth.user;

    return (
        <>
            <Head title="Staff Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Staff Management</h1>
                    <Button asChild>
                        <Link href={staffRoute.create()}>Invite Staff</Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card text-card-foreground">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-muted/50 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b last:border-0 hover:bg-muted/50"
                                >
                                    <td className="px-6 py-4 font-medium">
                                        {user.name}{' '}
                                        {user.id === authUser?.id && '(You)'}
                                    </td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className="rounded-md bg-secondary px-2 py-1 text-xs capitalize">
                                            {user.roles[0]?.name || 'No Role'}
                                        </span>
                                    </td>
                                    <td className="flex justify-end gap-2 px-6 py-4 text-right">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            asChild
                                            disabled={
                                                user.id === authUser?.id ||
                                                user.roles[0]?.name === 'owner'
                                            }
                                        >
                                            <Link
                                                href={staffRoute.edit({
                                                    staff: user.id,
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
                                                        'Are you sure you want to delete this staff member?',
                                                    )
                                                ) {
                                                    router.delete(
                                                        staffRoute.destroy({
                                                            staff: user.id,
                                                        }).url,
                                                    );
                                                }
                                            }}
                                            disabled={
                                                user.id === authUser?.id ||
                                                user.roles[0]?.name === 'owner'
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
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
            title: 'Staff Management',
            href: staffRoute.index(),
        },
    ],
};
