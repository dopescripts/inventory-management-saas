import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import staffRoute from '@/routes/staff';

export default function Edit({ staff }: { staff: any }) {
    const { data, setData, put, processing, errors } = useForm({
        name: staff.name,
        email: staff.email,
        role: staff.roles[0]?.name || 'staff',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(staffRoute.update({ staff: staff.id }).url);
    };

    return (
        <>
            <Head title="Edit Staff" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Edit Staff: {staff.name}
                    </h1>
                </div>

                <div className="max-w-2xl overflow-hidden rounded-xl border bg-card p-6 text-card-foreground">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                required
                            />
                            {errors.name && (
                                <div className="text-sm text-destructive">
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                required
                            />
                            {errors.email && (
                                <div className="text-sm text-destructive">
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <select
                                id="role"
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                value={data.role}
                                onChange={(e) =>
                                    setData('role', e.target.value)
                                }
                            >
                                <option value="manager">Manager</option>
                                <option value="staff">Staff</option>
                            </select>
                            {errors.role && (
                                <div className="text-sm text-destructive">
                                    {errors.role}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                Update Staff Member
                            </Button>
                            <Button
                                variant="outline"
                                asChild
                                disabled={processing}
                            >
                                <Link href={staffRoute.index()}>Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        {
            title: 'Staff Management',
            href: staffRoute.index(),
        },
        {
            title: 'Edit Staff',
            href: '', // Inertia will handle this gracefully
        },
    ],
};
