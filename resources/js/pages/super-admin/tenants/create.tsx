import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

interface Plan {
    id: number;
    name: string;
    price: string;
}

interface Props {
    plans: Plan[];
}

export default function Create({ plans }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        company_name: '',
        owner_name: '',
        owner_email: '',
        owner_password: '',
        billing_email: '',
        billing_phone: '',
        billing_address: '',
        plan_id: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/super-admin/tenants');
    };

    return (
        <>
            <Head title="Create Tenant" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/super-admin/tenants">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Create Tenant
                        </h1>
                        <p className="text-muted-foreground">
                            Manually create a new tenant account.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Company Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="company_name">
                                        Company Name *
                                    </Label>
                                    <Input
                                        id="company_name"
                                        value={data.company_name}
                                        onChange={(e) =>
                                            setData(
                                                'company_name',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <InputError message={errors.company_name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="billing_email">
                                        Billing Email
                                    </Label>
                                    <Input
                                        id="billing_email"
                                        type="email"
                                        value={data.billing_email}
                                        onChange={(e) =>
                                            setData(
                                                'billing_email',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.billing_email}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="billing_phone">
                                        Billing Phone
                                    </Label>
                                    <Input
                                        id="billing_phone"
                                        value={data.billing_phone}
                                        onChange={(e) =>
                                            setData(
                                                'billing_phone',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.billing_phone}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="billing_address">
                                        Billing Address
                                    </Label>
                                    <Input
                                        id="billing_address"
                                        value={data.billing_address}
                                        onChange={(e) =>
                                            setData(
                                                'billing_address',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.billing_address}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Owner Account</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="owner_name">
                                        Owner Name *
                                    </Label>
                                    <Input
                                        id="owner_name"
                                        value={data.owner_name}
                                        onChange={(e) =>
                                            setData(
                                                'owner_name',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <InputError message={errors.owner_name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="owner_email">
                                        Owner Email *
                                    </Label>
                                    <Input
                                        id="owner_email"
                                        type="email"
                                        value={data.owner_email}
                                        onChange={(e) =>
                                            setData(
                                                'owner_email',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <InputError message={errors.owner_email} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="owner_password">
                                        Password *
                                    </Label>
                                    <Input
                                        id="owner_password"
                                        type="password"
                                        value={data.owner_password}
                                        onChange={(e) =>
                                            setData(
                                                'owner_password',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.owner_password}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="plan_id">Assign Plan</Label>
                                    <select
                                        id="plan_id"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                        value={data.plan_id}
                                        onChange={(e) =>
                                            setData('plan_id', e.target.value)
                                        }
                                    >
                                        <option value="">
                                            No plan (trial)
                                        </option>
                                        {plans.map((plan) => (
                                            <option
                                                key={plan.id}
                                                value={plan.id}
                                            >
                                                {plan.name} ($
                                                {parseFloat(plan.price).toFixed(
                                                    2,
                                                )}
                                                /mo)
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.plan_id} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner className="mr-2" />}
                            Create Tenant
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
