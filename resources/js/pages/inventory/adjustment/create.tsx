import { Head, Link, useForm } from '@inertiajs/react';
import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import adjustments from '@/routes/adjustments';

interface Item {
    id: number;
    name: string;
    sku: string;
}

interface Location {
    id: number;
    warehouse_id: number;
    code: string;
}

interface Warehouse {
    id: number;
    name: string;
    locations: Location[];
}

interface Direction {
    value: string;
    label: string;
}

export default function Create({
    items,
    warehouses,
    directions,
}: {
    items: Item[];
    warehouses: Warehouse[];
    directions: Direction[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        item_id: '',
        warehouse_id: '',
        location_id: '',
        direction: '',
        quantity: '',
        reason: '',
        notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(adjustments.store.url());
    };

    const selectedWarehouse = useMemo(
        () => warehouses.find((w) => w.id.toString() === data.warehouse_id),
        [warehouses, data.warehouse_id],
    );
    const locations = selectedWarehouse?.locations || [];

    return (
        <>
            <Head title="New Adjustment" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 md:p-6">
                <div className="max-w-2xl">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold">New Adjustment</h1>
                        <p className="mt-1 text-muted-foreground">
                            Record a manual increase or decrease in stock level.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field className="md:col-span-2">
                                <FieldLabel htmlFor="item_id">Item</FieldLabel>
                                <Select
                                    value={data.item_id}
                                    onValueChange={(v) => setData('item_id', v)}
                                >
                                    <SelectTrigger id="item_id">
                                        <SelectValue placeholder="Select item" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {items.map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={item.id.toString()}
                                            >
                                                {item.name} ({item.sku})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError
                                    errors={[{ message: errors.item_id }]}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="warehouse_id">
                                    Warehouse
                                </FieldLabel>
                                <Select
                                    value={data.warehouse_id}
                                    onValueChange={(v) =>
                                        setData((data) => ({
                                            ...data,
                                            warehouse_id: v,
                                            location_id: '',
                                        }))
                                    }
                                >
                                    <SelectTrigger id="warehouse_id">
                                        <SelectValue placeholder="Select warehouse" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {warehouses.map((warehouse) => (
                                            <SelectItem
                                                key={warehouse.id}
                                                value={warehouse.id.toString()}
                                            >
                                                {warehouse.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError
                                    errors={[{ message: errors.warehouse_id }]}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="location_id">
                                    Location (Optional)
                                </FieldLabel>
                                <Select
                                    value={data.location_id}
                                    onValueChange={(v) =>
                                        setData('location_id', v)
                                    }
                                    disabled={
                                        !data.warehouse_id ||
                                        locations.length === 0
                                    }
                                >
                                    <SelectTrigger id="location_id">
                                        <SelectValue
                                            placeholder={
                                                locations.length === 0 &&
                                                data.warehouse_id
                                                    ? 'No locations found'
                                                    : 'Select location'
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locations.map((location) => (
                                            <SelectItem
                                                key={location.id}
                                                value={location.id.toString()}
                                            >
                                                {location.code}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError
                                    errors={[{ message: errors.location_id }]}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="direction">
                                    Adjustment Type
                                </FieldLabel>
                                <Select
                                    value={data.direction}
                                    onValueChange={(v) =>
                                        setData('direction', v)
                                    }
                                >
                                    <SelectTrigger id="direction">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {directions.map((dir) => (
                                            <SelectItem
                                                key={dir.value}
                                                value={dir.value}
                                            >
                                                {dir.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError
                                    errors={[{ message: errors.direction }]}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="quantity">
                                    Quantity
                                </FieldLabel>
                                <Input
                                    id="quantity"
                                    type="number"
                                    step="0.0001"
                                    min="0"
                                    value={data.quantity}
                                    onChange={(e) =>
                                        setData('quantity', e.target.value)
                                    }
                                />
                                <FieldError
                                    errors={[{ message: errors.quantity }]}
                                />
                            </Field>

                            <Field className="md:col-span-2">
                                <FieldLabel htmlFor="reason">
                                    Reason (Optional)
                                </FieldLabel>
                                <Select
                                    value={data.reason}
                                    onValueChange={(v) => setData('reason', v)}
                                >
                                    <SelectTrigger id="reason">
                                        <SelectValue placeholder="Select reason" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Opening Stock">
                                            Opening Stock
                                        </SelectItem>
                                        <SelectItem value="Count Discrepancy">
                                            Count Discrepancy
                                        </SelectItem>
                                        <SelectItem value="Damage / Loss">
                                            Damage / Loss
                                        </SelectItem>
                                        <SelectItem value="Correction">
                                            Correction
                                        </SelectItem>
                                        <SelectItem value="Other">
                                            Other
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FieldError
                                    errors={[{ message: errors.reason }]}
                                />
                            </Field>

                            <Field className="md:col-span-2">
                                <FieldLabel htmlFor="notes">
                                    Additional Notes
                                </FieldLabel>
                                <textarea
                                    id="notes"
                                    className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData('notes', e.target.value)
                                    }
                                    placeholder="Any other details..."
                                />
                                <FieldError
                                    errors={[{ message: errors.notes }]}
                                />
                            </Field>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button type="submit" disabled={processing}>
                                Save Adjustment
                            </Button>
                            <Button
                                variant="outline"
                                asChild
                                disabled={processing}
                            >
                                <Link href={adjustments.index()}>Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

Create.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Adjustments', href: adjustments.index() },
            { title: 'New', href: adjustments.create() },
        ]}
    >
        {page}
    </AppLayout>
);
