import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

interface TenantData {
    id: number;
    name: string;
    billing_email: string | null;
    billing_phone: string | null;
    billing_address: string | null;
    tax_id: string | null;
}

interface Props {
    tenant: TenantData;
}

export default function EditTenant({ tenant }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        company_name: tenant.name,
        billing_email: tenant.billing_email ?? '',
        billing_phone: tenant.billing_phone ?? '',
        billing_address: tenant.billing_address ?? '',
        tax_id: tenant.tax_id ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/super-admin/tenants/${tenant.id}`);
    };

    return (
        <>
            <Head title={`Edit: ${tenant.name}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/super-admin/tenants">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Edit Tenant
                        </h1>
                        <p className="text-muted-foreground">{tenant.name}</p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Tenant Details</CardTitle>
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
                                        setData('company_name', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.company_name} />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
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
                                <InputError message={errors.billing_address} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tax_id">Tax ID</Label>
                                <Input
                                    id="tax_id"
                                    value={data.tax_id}
                                    onChange={(e) =>
                                        setData('tax_id', e.target.value)
                                    }
                                />
                                <InputError message={errors.tax_id} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6 flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner className="mr-2" />}
                            Update Tenant
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
