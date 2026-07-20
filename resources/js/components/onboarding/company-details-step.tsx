import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';

interface Props {
    tenant: {
        id: number;
        name: string;
        logo: string | null;
        billing_address: string | null;
        billing_phone: string | null;
        billing_email: string | null;
        tax_id: string | null;
    };
}

export default function CompanyDetailsStep({ tenant }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: tenant.name || '',
        logo: null as File | null,
        billing_address: tenant.billing_address || '',
        billing_phone: tenant.billing_phone || '',
        billing_email: tenant.billing_email || '',
        tax_id: tenant.tax_id || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/onboarding/company', {
            forceFormData: true,
        });
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="logo">Company Logo</Label>
                    <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setData('logo', e.target.files?.[0] || null)
                        }
                    />
                    <InputError message={errors.logo} />
                    {tenant.logo && (
                        <img
                            src={`/storage/${tenant.logo}`}
                            alt="Current logo"
                            className="h-12 w-12 rounded object-cover"
                        />
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="billing_email">Billing Email</Label>
                    <Input
                        id="billing_email"
                        type="email"
                        value={data.billing_email}
                        onChange={(e) =>
                            setData('billing_email', e.target.value)
                        }
                    />
                    <InputError message={errors.billing_email} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="billing_phone">Billing Phone</Label>
                    <Input
                        id="billing_phone"
                        type="tel"
                        value={data.billing_phone}
                        onChange={(e) =>
                            setData('billing_phone', e.target.value)
                        }
                    />
                    <InputError message={errors.billing_phone} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="billing_address">Billing Address</Label>
                    <Textarea
                        id="billing_address"
                        value={data.billing_address}
                        onChange={(e) =>
                            setData('billing_address', e.target.value)
                        }
                        rows={3}
                    />
                    <InputError message={errors.billing_address} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="tax_id">Tax ID (optional)</Label>
                    <Input
                        id="tax_id"
                        value={data.tax_id}
                        onChange={(e) => setData('tax_id', e.target.value)}
                    />
                    <InputError message={errors.tax_id} />
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={processing}>
                {processing && <Spinner />}
                Continue
            </Button>
        </form>
    );
}
