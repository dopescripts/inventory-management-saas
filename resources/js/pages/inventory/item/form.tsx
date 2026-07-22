import { Link, useForm, useHttp } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import brands from '@/routes/brands';
import categories from '@/routes/categories';
import items from '@/routes/items';
import units from '@/routes/units';

type LookupOption = {
    id: number;
    name: string;
    short_name?: string;
};

type ItemFormData = {
    name: string;
    sku: string;
    barcode: string;
    category_id: string;
    brand_id: string;
    unit_id: string;
    type: string;
    track_inventory: boolean;
    low_stock_threshold: string;
    description: string;
    is_active: boolean;
};

type ItemFormProps = {
    item?: {
        id: number;
        name: string;
        sku: string;
        barcode: string | null;
        category_id: number | null;
        brand_id: number | null;
        unit_id: number;
        type: string;
        track_inventory: boolean;
        low_stock_threshold: number;
        description: string | null;
        is_active: boolean;
    };
    categories: LookupOption[];
    brands: LookupOption[];
    units: Array<LookupOption & { short_name: string }>;
};

const itemTypes = [
    { value: 'stock', label: 'Stock Item' },
    { value: 'service', label: 'Service' },
];

const unitTypes = ['unit', 'weight', 'volume', 'length', 'area', 'time'];

// ─── Quick-create: Category ──────────────────────────────────────────────────

type QuickCategoryFormData = {
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
};

function QuickCreateCategoryDialog({
    open,
    onClose,
    onCreated,
}: {
    open: boolean;
    onClose: () => void;
    onCreated: (item: LookupOption) => void;
}) {
    const { data, setData, post, processing, errors, reset } =
        useHttp<QuickCategoryFormData>({
            name: '',
            slug: '',
            description: '',
            is_active: true,
        });

    const submit = (event: React.FormEvent): void => {
        event.preventDefault();

        post(categories.store.url(), {
            onSuccess: (response: any) => {
                const item = response.data || response;
                onCreated({ id: item.id, name: item.name });
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4 pt-2">
                    <Field>
                        <FieldLabel htmlFor="quick-category-name">
                            Name
                        </FieldLabel>
                        <Input
                            id="quick-category-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoFocus
                        />
                        <FieldError errors={[{ message: errors.name }]} />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="quick-category-slug">
                            Slug
                        </FieldLabel>
                        <Input
                            id="quick-category-slug"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            placeholder="Auto-generated from name"
                        />
                        <FieldError errors={[{ message: errors.slug }]} />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="quick-category-description">
                            Description
                        </FieldLabel>
                        <textarea
                            id="quick-category-description"
                            className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        />
                        <FieldError
                            errors={[{ message: errors.description }]}
                        />
                    </Field>

                    <div className="flex items-center gap-3">
                        <Switch
                            id="quick-category-is_active"
                            checked={data.is_active}
                            onCheckedChange={(checked) =>
                                setData('is_active', checked)
                            }
                        />
                        <Label htmlFor="quick-category-is_active">Active</Label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating…' : 'Create Category'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ─── Quick-create: Brand ─────────────────────────────────────────────────────

type QuickBrandFormData = {
    name: string;
    description: string;
    is_active: boolean;
};

function QuickCreateBrandDialog({
    open,
    onClose,
    onCreated,
}: {
    open: boolean;
    onClose: () => void;
    onCreated: (item: LookupOption) => void;
}) {
    const { data, setData, post, processing, errors, reset } =
        useHttp<QuickBrandFormData>({
            name: '',
            description: '',
            is_active: true,
        });

    const submit = (event: React.FormEvent): void => {
        event.preventDefault();

        post(brands.store.url(), {
            onSuccess: (response: any) => {
                const item = response.data || response;
                onCreated({ id: item.id, name: item.name });
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Brand</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4 pt-2">
                    <Field>
                        <FieldLabel htmlFor="quick-brand-name">Name</FieldLabel>
                        <Input
                            id="quick-brand-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoFocus
                        />
                        <FieldError errors={[{ message: errors.name }]} />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="quick-brand-description">
                            Description
                        </FieldLabel>
                        <textarea
                            id="quick-brand-description"
                            className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        />
                        <FieldError
                            errors={[{ message: errors.description }]}
                        />
                    </Field>

                    <div className="flex items-center gap-3">
                        <Switch
                            id="quick-brand-is_active"
                            checked={data.is_active}
                            onCheckedChange={(checked) =>
                                setData('is_active', checked)
                            }
                        />
                        <Label htmlFor="quick-brand-is_active">Active</Label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating…' : 'Create Brand'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ─── Quick-create: Unit ──────────────────────────────────────────────────────

type QuickUnitFormData = {
    name: string;
    short_name: string;
    type: string;
    description: string;
    is_active: boolean;
};

function QuickCreateUnitDialog({
    open,
    onClose,
    onCreated,
}: {
    open: boolean;
    onClose: () => void;
    onCreated: (item: LookupOption & { short_name: string }) => void;
}) {
    const { data, setData, post, processing, errors, reset } =
        useHttp<QuickUnitFormData>({
            name: '',
            short_name: '',
            type: 'unit',
            description: '',
            is_active: true,
        });

    const submit = (event: React.FormEvent): void => {
        event.preventDefault();

        post(units.store.url(), {
            onSuccess: (response: any) => {
                const item = response.data || response;
                onCreated({
                    id: item.id,
                    name: item.name,
                    short_name: item.short_name,
                });
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Unit</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4 pt-2">
                    <Field>
                        <FieldLabel htmlFor="quick-unit-name">Name</FieldLabel>
                        <Input
                            id="quick-unit-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoFocus
                        />
                        <FieldError errors={[{ message: errors.name }]} />
                    </Field>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="quick-unit-short_name">
                                Short Name
                            </FieldLabel>
                            <Input
                                id="quick-unit-short_name"
                                value={data.short_name}
                                onChange={(e) =>
                                    setData('short_name', e.target.value)
                                }
                                required
                            />
                            <FieldError
                                errors={[{ message: errors.short_name }]}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="quick-unit-type">
                                Type
                            </FieldLabel>
                            <select
                                id="quick-unit-type"
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                value={data.type}
                                onChange={(e) =>
                                    setData('type', e.target.value)
                                }
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
                        <FieldLabel htmlFor="quick-unit-description">
                            Description
                        </FieldLabel>
                        <textarea
                            id="quick-unit-description"
                            className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        />
                        <FieldError
                            errors={[{ message: errors.description }]}
                        />
                    </Field>

                    <div className="flex items-center gap-3">
                        <Switch
                            id="quick-unit-is_active"
                            checked={data.is_active}
                            onCheckedChange={(checked) =>
                                setData('is_active', checked)
                            }
                        />
                        <Label htmlFor="quick-unit-is_active">Active</Label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating…' : 'Create Unit'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ─── Main Item Form ──────────────────────────────────────────────────────────

export default function ItemForm({
    item,
    categories: initialCategoryOptions,
    brands: initialBrandOptions,
    units: initialUnitOptions,
}: ItemFormProps) {
    const [categoryOptions, setCategoryOptions] = useState(
        initialCategoryOptions,
    );
    const [brandOptions, setBrandOptions] = useState(initialBrandOptions);
    const [unitOptions, setUnitOptions] = useState(initialUnitOptions);
    const { data, setData, post, put, processing, errors } =
        useForm<ItemFormData>({
            name: item?.name ?? '',
            sku: item?.sku ?? '',
            barcode: item?.barcode ?? '',
            category_id: item?.category_id?.toString() ?? '',
            brand_id: item?.brand_id?.toString() ?? '',
            unit_id: item?.unit_id?.toString() ?? '',
            type: item?.type ?? 'stock',
            track_inventory: item?.track_inventory ?? true,
            low_stock_threshold: item?.low_stock_threshold?.toString() ?? '0',
            description: item?.description ?? '',
            is_active: item?.is_active ?? true,
        });

    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [brandDialogOpen, setBrandDialogOpen] = useState(false);
    const [unitDialogOpen, setUnitDialogOpen] = useState(false);

    const submit = (event: React.FormEvent): void => {
        event.preventDefault();

        if (item) {
            put(items.update({ item: item.id }).url);

            return;
        }

        post(items.store.url());
    };

    return (
        <>
            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <Field>
                        <FieldLabel htmlFor="name">Name</FieldLabel>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(event) =>
                                setData('name', event.target.value)
                            }
                            required
                        />
                        <FieldError errors={[{ message: errors.name }]} />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="sku">SKU</FieldLabel>
                        <Input
                            id="sku"
                            value={data.sku}
                            onChange={(event) =>
                                setData('sku', event.target.value)
                            }
                            required
                        />
                        <FieldError errors={[{ message: errors.sku }]} />
                    </Field>
                </div>

                <Field>
                    <FieldLabel htmlFor="barcode">Barcode</FieldLabel>
                    <Input
                        id="barcode"
                        value={data.barcode}
                        onChange={(event) =>
                            setData('barcode', event.target.value)
                        }
                    />
                    <FieldError errors={[{ message: errors.barcode }]} />
                </Field>

                <div className="grid gap-4 md:grid-cols-3">
                    <Field>
                        <FieldLabel htmlFor="category_id">Category</FieldLabel>
                        <div className="flex gap-2">
                            <Select
                                value={data.category_id}
                                onValueChange={(value) =>
                                    setData('category_id', value)
                                }
                            >
                                <SelectTrigger
                                    id="category_id"
                                    className="w-full"
                                >
                                    <SelectValue placeholder="None" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryOptions.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id.toString()}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                title="Add new category"
                                onClick={() => setCategoryDialogOpen(true)}
                            >
                                <Plus />
                            </Button>
                        </div>
                        <FieldError
                            errors={[{ message: errors.category_id }]}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="brand_id">Brand</FieldLabel>
                        <div className="flex gap-2">
                            <Select
                                value={data.brand_id}
                                onValueChange={(value) =>
                                    setData('brand_id', value)
                                }
                            >
                                <SelectTrigger id="brand_id" className="w-full">
                                    <SelectValue placeholder="None" />
                                </SelectTrigger>
                                <SelectContent>
                                    {brandOptions.map((brand) => (
                                        <SelectItem
                                            key={brand.id}
                                            value={brand.id.toString()}
                                        >
                                            {brand.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                title="Add new brand"
                                onClick={() => setBrandDialogOpen(true)}
                            >
                                <Plus />
                            </Button>
                        </div>
                        <FieldError errors={[{ message: errors.brand_id }]} />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="unit_id">Unit</FieldLabel>
                        <div className="flex gap-2">
                            <Select
                                value={data.unit_id}
                                onValueChange={(value) =>
                                    setData('unit_id', value)
                                }
                            >
                                <SelectTrigger id="unit_id" className="w-full">
                                    <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {unitOptions.map((unit) => (
                                        <SelectItem
                                            key={unit.id}
                                            value={unit.id.toString()}
                                        >
                                            {unit.name} ({unit.short_name})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                title="Add new unit"
                                onClick={() => setUnitDialogOpen(true)}
                            >
                                <Plus />
                            </Button>
                        </div>
                        <FieldError errors={[{ message: errors.unit_id }]} />
                    </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Field>
                        <FieldLabel htmlFor="type">Type</FieldLabel>
                        <Select
                            value={data.type}
                            onValueChange={(value) => setData('type', value)}
                        >
                            <SelectTrigger id="type" className="w-full">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {itemTypes.map((type) => (
                                    <SelectItem
                                        key={type.value}
                                        value={type.value}
                                    >
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FieldError errors={[{ message: errors.type }]} />
                    </Field>

                    <div className="flex items-center gap-3 pt-7">
                        <Switch
                            id="track_inventory"
                            checked={data.track_inventory}
                            onCheckedChange={(checked) =>
                                setData('track_inventory', checked)
                            }
                        />
                        <Label htmlFor="track_inventory">Track Inventory</Label>
                    </div>

                    {data.track_inventory && (
                        <Field>
                            <FieldLabel htmlFor="low_stock_threshold">
                                Low Stock
                            </FieldLabel>
                            <Input
                                id="low_stock_threshold"
                                type="number"
                                min="0"
                                value={data.low_stock_threshold}
                                onChange={(event) =>
                                    setData(
                                        'low_stock_threshold',
                                        event.target.value,
                                    )
                                }
                            />
                            <FieldError
                                errors={[
                                    { message: errors.low_stock_threshold },
                                ]}
                            />
                        </Field>
                    )}
                </div>

                <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <textarea
                        id="description"
                        className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={data.description}
                        onChange={(event) =>
                            setData('description', event.target.value)
                        }
                    />
                    <FieldError errors={[{ message: errors.description }]} />
                </Field>

                <div className="flex items-center gap-3">
                    <Switch
                        id="is_active"
                        checked={data.is_active}
                        onCheckedChange={(checked) =>
                            setData('is_active', checked)
                        }
                    />
                    <Label htmlFor="is_active">Active</Label>
                </div>
                <FieldError errors={[{ message: errors.is_active }]} />

                <div className="flex items-center gap-3">
                    <Button type="submit" disabled={processing}>
                        {item ? 'Update Item' : 'Create Item'}
                    </Button>
                    <Button variant="outline" asChild disabled={processing}>
                        <Link href={items.index()}>Cancel</Link>
                    </Button>
                </div>
            </form>

            <QuickCreateCategoryDialog
                open={categoryDialogOpen}
                onClose={() => setCategoryDialogOpen(false)}
                onCreated={(item) => {
                    setCategoryOptions((prev) =>
                        [...prev, item].sort((a, b) =>
                            a.name.localeCompare(b.name),
                        ),
                    );
                    setData('category_id', item.id.toString());
                }}
            />

            <QuickCreateBrandDialog
                open={brandDialogOpen}
                onClose={() => setBrandDialogOpen(false)}
                onCreated={(item) => {
                    setBrandOptions((prev) =>
                        [...prev, item].sort((a, b) =>
                            a.name.localeCompare(b.name),
                        ),
                    );
                    setData('brand_id', item.id.toString());
                }}
            />

            <QuickCreateUnitDialog
                open={unitDialogOpen}
                onClose={() => setUnitDialogOpen(false)}
                onCreated={(item) => {
                    setUnitOptions((prev) =>
                        [...prev, item].sort((a, b) =>
                            a.name.localeCompare(b.name),
                        ),
                    );
                    setData('unit_id', item.id.toString());
                }}
            />
        </>
    );
}
