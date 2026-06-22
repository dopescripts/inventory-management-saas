import { Head, useForm, Link } from '@inertiajs/react';
import staff from '@/routes/staff';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        role: 'staff',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(staff.store());
    };

    return (
        <>
            <Head title="Invite Staff" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Invite Staff</h1>
                </div>

                <div className="bg-card text-card-foreground border rounded-xl overflow-hidden p-6 max-w-2xl">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <div className="text-sm text-destructive">{errors.name}</div>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <div className="text-sm text-destructive">{errors.email}</div>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <select
                                id="role"
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                            >
                                <option value="manager">Manager</option>
                                <option value="staff">Staff</option>
                            </select>
                            {errors.role && <div className="text-sm text-destructive">{errors.role}</div>}
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                Invite Staff Member
                            </Button>
                            <Button variant="outline" asChild disabled={processing}>
                                <Link href={staff.index()}>Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Staff Management',
            href: staff.index(),
        },
        {
            title: 'Invite Staff',
            href: staff.create(),
        },
    ],
};
