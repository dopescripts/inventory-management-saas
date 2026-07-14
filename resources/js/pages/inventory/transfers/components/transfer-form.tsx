import { Link, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import React, { useMemo } from 'react';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import transfers from '@/routes/transfers';


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

interface TransferItemForm {
    item_id: string;
    quantity_requested: string;
    remarks: string;
}

interface Transfer {
    id: number;

    source_warehouse_id: number | null;
    source_location_id: number | null;

    destination_warehouse_id: number | null;
    destination_location_id: number | null;

    notes: string | null;

    items: TransferItem[];
}

interface TransferItem {
    item_id: number;

    quantity_requested: number;

    remarks: string | null;
}

interface Props {
    warehouses: Warehouse[];

    items: Item[];

    transfer?: Transfer;
}

export default function TransferForm({ warehouses, items, transfer }: Props) {
    const isEdit = !!transfer;

    const { data, setData, post, put, processing, errors } = useForm({
        source_warehouse_id: transfer?.source_warehouse_id?.toString() ?? '',

        source_location_id: transfer?.source_location_id?.toString() ?? '',

        destination_warehouse_id:
            transfer?.destination_warehouse_id?.toString() ?? '',

        destination_location_id:
            transfer?.destination_location_id?.toString() ?? '',

        notes: transfer?.notes ?? '',

        items: transfer?.items?.map((item) => ({
            item_id: item.item_id.toString(),
            quantity_requested: item.quantity_requested.toString(),
            remarks: item.remarks ?? '',
        })) ?? [
            {
                item_id: '',
                quantity_requested: '',
                remarks: '',
            },
        ],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(
                transfers.update({
                    transfer: transfer!.id,
                }).url,
            );

            return;
        }

        post(transfers.store.url());
    };

    const sourceWarehouse = useMemo(
        () =>
            warehouses.find(
                (w) => w.id.toString() === data.source_warehouse_id,
            ),
        [warehouses, data.source_warehouse_id],
    );

    const destinationWarehouse = useMemo(
        () =>
            warehouses.find(
                (w) => w.id.toString() === data.destination_warehouse_id,
            ),
        [warehouses, data.destination_warehouse_id],
    );

    const sourceLocations = sourceWarehouse?.locations ?? [];

    const destinationLocations = destinationWarehouse?.locations ?? [];

    const addItem = () => {
        setData('items', [
            ...data.items,

            {
                item_id: '',
                quantity_requested: '',
                remarks: '',
            },
        ]);
    };

    const removeItem = (index: number) => {
        setData(
            'items',
            data.items.filter((_, i) => i !== index),
        );
    };

    const updateItem = (
        index: number,
        key: keyof TransferItemForm,
        value: string,
    ) => {
        const items = [...data.items];

        items[index][key] = value;

        setData('items', items);
    };

    const selectedItems = data.items.map((i) => i.item_id);

    return (
        <form onSubmit={submit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>General Information</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-4 md:grid-cols-2">
                    <Field>
                        <FieldLabel>Source Warehouse</FieldLabel>

                        <Select
                            value={data.source_warehouse_id}
                            onValueChange={(value) =>
                                setData((current) => ({
                                    ...current,
                                    source_warehouse_id: value,
                                    source_location_id: '',
                                }))
                            }
                        >
                            <SelectTrigger>
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
                            errors={[
                                {
                                    message: errors.source_warehouse_id,
                                },
                            ]}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Destination Warehouse</FieldLabel>

                        <Select
                            value={data.destination_warehouse_id}
                            onValueChange={(value) =>
                                setData((current) => ({
                                    ...current,
                                    destination_warehouse_id: value,
                                    destination_location_id: '',
                                }))
                            }
                        >
                            <SelectTrigger>
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
                            errors={[
                                {
                                    message: errors.destination_warehouse_id,
                                },
                            ]}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Source Location</FieldLabel>

                        <Select
                            value={data.source_location_id}
                            onValueChange={(value) =>
                                setData('source_location_id', value)
                            }
                            disabled={!data.source_warehouse_id}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                            </SelectTrigger>

                            <SelectContent>
                                {sourceLocations.map((location) => (
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
                            errors={[
                                {
                                    message: errors.source_location_id,
                                },
                            ]}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Destination Location</FieldLabel>

                        <Select
                            value={data.destination_location_id}
                            onValueChange={(value) =>
                                setData('destination_location_id', value)
                            }
                            disabled={!data.destination_warehouse_id}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                            </SelectTrigger>

                            <SelectContent>
                                {destinationLocations.map((location) => (
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
                            errors={[
                                {
                                    message: errors.destination_location_id,
                                },
                            ]}
                        />
                    </Field>

                    <Field className="md:col-span-2">
                        <FieldLabel>Notes</FieldLabel>

                        <textarea
                            className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                        />

                        <FieldError
                            errors={[
                                {
                                    message: errors.notes,
                                },
                            ]}
                        />
                    </Field>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Items</CardTitle>

                    <Button type="button" variant="outline" onClick={addItem}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                    </Button>
                </CardHeader>

                <CardContent className="space-y-4">
                    {data.items.map((row, index) => (
                        <div
                            key={index}
                            className="grid gap-4 rounded-lg border p-4 md:grid-cols-12"
                        >
                            <Field className="md:col-span-4">
                                <FieldLabel>Item</FieldLabel>

                                <Select
                                    value={row.item_id}
                                    onValueChange={(value) =>
                                        updateItem(index, 'item_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select item" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {items
                                            .filter((item) => {
                                                return (
                                                    !selectedItems.includes(
                                                        item.id.toString(),
                                                    ) ||
                                                    row.item_id ===
                                                        item.id.toString()
                                                );
                                            })
                                            .map((item) => (
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
                                    errors={[
                                        {
                                            message:
                                                errors[
                                                    `items.${index}.item_id` as keyof typeof errors
                                                ],
                                        },
                                    ]}
                                />
                            </Field>

                            <Field className="md:col-span-2">
                                <FieldLabel>Quantity</FieldLabel>

                                <Input
                                    type="number"
                                    min="0"
                                    step="0.0001"
                                    value={row.quantity_requested}
                                    onChange={(e) =>
                                        updateItem(
                                            index,
                                            'quantity_requested',
                                            e.target.value,
                                        )
                                    }
                                />

                                <FieldError
                                    errors={[
                                        {
                                            message:
                                                errors[
                                                    `items.${index}.quantity_requested` as keyof typeof errors
                                                ],
                                        },
                                    ]}
                                />
                            </Field>

                            <Field className="md:col-span-5">
                                <FieldLabel>Remarks</FieldLabel>

                                <Input
                                    value={row.remarks}
                                    onChange={(e) =>
                                        updateItem(
                                            index,
                                            'remarks',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Optional remarks..."
                                />
                            </Field>

                            <div className="flex items-end justify-center md:col-span-1">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    disabled={data.items.length === 1}
                                    onClick={() => removeItem(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="flex items-center gap-3">
                <Button type="submit" disabled={processing}>
                    {isEdit ? 'Update Transfer' : 'Create Transfer'}
                </Button>

                <Button variant="outline" asChild disabled={processing}>
                    <Link href={transfers.index()}>Cancel</Link>
                </Button>
            </div>
        </form>
    );
}
