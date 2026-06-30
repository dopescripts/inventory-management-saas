import { Head } from '@inertiajs/react'
import React from 'react'
import warehouses from '@/routes/warehouses';
import { Input } from '@/components/ui/input';
import { useForm } from '@inertiajs/react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';

import { usePage } from '@inertiajs/react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

function create() {
    const auth = usePage().props.auth as any;
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
        phone: '',
        email: '',
        is_active: true,
    });

    const randomNum = React.useRef(Math.floor(Math.random() * 10000));

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        const tenantId = auth?.user?.tenant_id || '';
        const baseName = newName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10);
        const autoCode = baseName ? `${baseName}-${tenantId}-${randomNum.current}` : '';

        setData(current => ({
            ...current,
            name: newName,
            code: autoCode,
        }));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(warehouses.store.url());
    };

    return (
        <>
            <Head title="Create Warehouse" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Create Warehouse</h1>
                </div>

                <div className="bg-card text-card-foreground border rounded-xl overflow-hidden p-6 max-w-5xl">
                    <form onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <Field>
                                    <FieldLabel htmlFor="name">Name *</FieldLabel>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={handleNameChange}
                                        placeholder="e.g: main warehouse"
                                        required
                                    />
                                    {errors.name && <FieldError errors={[{ message: errors.name }]} />}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="code">Code *</FieldLabel>
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                        placeholder="Auto-generated"
                                        required
                                    />
                                    {errors.code && <FieldError errors={[{ message: errors.code }]} />}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="email">Contact Person Email</FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Contact email"
                                    />
                                    {errors.email && <FieldError errors={[{ message: errors.email }]} />}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="phone">Contact Person Phone</FieldLabel>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="Contact phone"
                                    />
                                    {errors.phone && <FieldError errors={[{ message: errors.phone }]} />}
                                </Field>

                                <div className="flex items-center space-x-2 pt-4">
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                    <Label htmlFor="is_active">Active Status</Label>
                                </div>
                                {errors.is_active && <FieldError errors={[{ message: errors.is_active }]} />}
                            </div>

                            <div className="space-y-6">
                                <Field>
                                    <FieldLabel htmlFor="address_line_1">Address Line 1</FieldLabel>
                                    <Input
                                        id="address_line_1"
                                        value={data.address_line_1}
                                        onChange={(e) => setData('address_line_1', e.target.value)}
                                        placeholder="Street address"
                                    />
                                    {errors.address_line_1 && <FieldError errors={[{ message: errors.address_line_1 }]} />}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="address_line_2">Address Line 2</FieldLabel>
                                    <Input
                                        id="address_line_2"
                                        value={data.address_line_2}
                                        onChange={(e) => setData('address_line_2', e.target.value)}
                                        placeholder="Apartment, suite, etc."
                                    />
                                    {errors.address_line_2 && <FieldError errors={[{ message: errors.address_line_2 }]} />}
                                </Field>

                                <div className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="city">City</FieldLabel>
                                        <Input
                                            id="city"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                        />
                                        {errors.city && <FieldError errors={[{ message: errors.city }]} />}
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="state">State</FieldLabel>
                                        <Input
                                            id="state"
                                            value={data.state}
                                            onChange={(e) => setData('state', e.target.value)}
                                        />
                                        {errors.state && <FieldError errors={[{ message: errors.state }]} />}
                                    </Field>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="zip_code">ZIP Code</FieldLabel>
                                        <Input
                                            id="zip_code"
                                            value={data.zip_code}
                                            onChange={(e) => setData('zip_code', e.target.value)}
                                        />
                                        {errors.zip_code && <FieldError errors={[{ message: errors.zip_code }]} />}
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="country">Country</FieldLabel>
                                        <Input
                                            id="country"
                                            value={data.country}
                                            onChange={(e) => setData('country', e.target.value)}
                                        />
                                        {errors.country && <FieldError errors={[{ message: errors.country }]} />}
                                    </Field>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <Button type="submit" disabled={processing} className="w-full md:w-auto">
                                {processing ? 'Creating...' : 'Create Warehouse'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

create.layout = {
    breadcrumbs: [
        {
            title: 'Inventory',
            href: '',
        },
        {
            title: 'Warehouses',
            href: warehouses.index(),
        },
        {
            title: 'Create',
            href: '',
        },
    ],
};

export default create