import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Link, useForm } from '@inertiajs/react';
import React from 'react';
import units from '@/routes/units';

type UnitFormData = {
    name: string;
    short_name: string;
    type: string;
    description: string;
    is_active: boolean;
};

type UnitFormProps = {
    unit?: {
        id: number;
        name: string;
        short_name: string;
        type: string;
        description: string | null;
        is_active: boolean;
    };
};

const unitTypes = ['unit', 'weight', 'volume', 'length', 'area', 'time'];

export default function UnitForm({ unit }: UnitFormProps) {
    const { data, setData, post, put, processing, errors } = useForm<UnitFormData>({
        name: unit?.name ?? '',
        short_name: unit?.short_name ?? '',
        type: unit?.type ?? 'unit',
        description: unit?.description ?? '',
        is_active: unit?.is_active ?? true,
    });

    const submit = (event: React.FormEvent): void => {
        event.preventDefault();

        if (unit) {
            put(units.update({ unit: unit.id }).url());

            return;
        }

        post(units.store.url());
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" value={data.name} onChange={(event) => setData('name', event.target.value)} required />
                <FieldError errors={[{ message: errors.name }]} />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
                <Field>
                    <FieldLabel htmlFor="short_name">Short Name</FieldLabel>
                    <Input id="short_name" value={data.short_name} onChange={(event) => setData('short_name', event.target.value)} required />
                    <FieldError errors={[{ message: errors.short_name }]} />
                </Field>

                <Field>
                    <FieldLabel htmlFor="type">Type</FieldLabel>
                    <select
                        id="type"
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={data.type}
                        onChange={(event) => setData('type', event.target.value)}
                    >
                        {unitTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    <FieldError errors={[{ message: errors.type }]} />
                </Field>
            </div>

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
                    {unit ? 'Update Unit' : 'Create Unit'}
                </Button>
                <Button variant="outline" asChild disabled={processing}>
                    <Link href={units.index()}>Cancel</Link>
                </Button>
            </div>
        </form>
    );
}
