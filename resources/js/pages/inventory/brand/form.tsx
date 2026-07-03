import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Link, useForm } from '@inertiajs/react';
import React from 'react';
import brands from '@/routes/brands';

type BrandFormData = {
    name: string;
    description: string;
    is_active: boolean;
};

type BrandFormProps = {
    brand?: {
        id: number;
        name: string;
        description: string | null;
        is_active: boolean;
    };
};

export default function BrandForm({ brand }: BrandFormProps) {
    const { data, setData, post, put, processing, errors } = useForm<BrandFormData>({
        name: brand?.name ?? '',
        description: brand?.description ?? '',
        is_active: brand?.is_active ?? true,
    });

    const submit = (event: React.FormEvent): void => {
        event.preventDefault();

        if (brand) {
            put(brands.update({ brand: brand.id }).url());

            return;
        }

        post(brands.store.url());
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" value={data.name} onChange={(event) => setData('name', event.target.value)} required />
                <FieldError errors={[{ message: errors.name }]} />
            </Field>

            <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <textarea
                    id="description"
                    className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={data.description}
                    onChange={(event) => setData('description', event.target.value)}
                />
                <FieldError errors={[{ message: errors.description }]} />
            </Field>

            <div className="flex items-center gap-3">
                <Switch id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked)} />
                <Label htmlFor="is_active">Active</Label>
            </div>
            <FieldError errors={[{ message: errors.is_active }]} />

            <div className="flex items-center gap-3">
                <Button type="submit" disabled={processing}>
                    {brand ? 'Update Brand' : 'Create Brand'}
                </Button>
                <Button variant="outline" asChild disabled={processing}>
                    <Link href={brands.index()}>Cancel</Link>
                </Button>
            </div>
        </form>
    );
}
