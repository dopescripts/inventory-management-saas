import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Link, useForm } from '@inertiajs/react';
import React from 'react';
import categories from '@/routes/categories';
import { Label } from '@/components/ui/label';

type CategoryFormData = {
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
};

type CategoryFormProps = {
    category?: {
        id: number;
        name: string;
        slug: string;
        description: string | null;
        is_active: boolean;
    };
};

export default function CategoryForm({ category }: CategoryFormProps) {
    const { data, setData, post, put, processing, errors } = useForm<CategoryFormData>({
        name: category?.name ?? '',
        slug: category?.slug ?? '',
        description: category?.description ?? '',
        is_active: category?.is_active ?? true,
    });

    const submit = (event: React.FormEvent): void => {
        event.preventDefault();

        if (category) {
            put(categories.update({ category: category.id }).url());

            return;
        }

        post(categories.store.url());
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" value={data.name} onChange={(event) => setData('name', event.target.value)} required />
                <FieldError errors={[{ message: errors.name }]} />
            </Field>

            <Field>
                <FieldLabel htmlFor="slug">Slug</FieldLabel>
                <Input id="slug" value={data.slug} onChange={(event) => setData('slug', event.target.value)} placeholder="Auto-generated from name" />
                <FieldError errors={[{ message: errors.slug }]} />
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
                    {category ? 'Update Category' : 'Create Category'}
                </Button>
                <Button variant="outline" asChild disabled={processing}>
                    <Link href={categories.index()}>Cancel</Link>
                </Button>
            </div>
        </form>
    );
}
