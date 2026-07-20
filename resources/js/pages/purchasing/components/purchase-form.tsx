import { Link, useForm, useHttp } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import purchases from '@/routes/purchases';
import vendors from '@/routes/vendors';

interface Item {
    id: number;
    name: string;
    sku: string;
}

interface Vendor {
    id: number;
    name: string;
}

interface PurchaseItemForm {
    item_id: string;
    quantity_ordered: string;
    unit_cost: string;
    discount: string;
    tax: string;
    remarks: string;
}

interface PurchaseOrder {
    id: number;
    vendor_id: number | null;
    expected_date: string | null;
    discount: string;
    tax: string;
    shipping: string;
    notes: string | null;
    items: {
        item_id: number;
        quantity_ordered: string;
        unit_cost: string;
        discount: string;
        tax: string;
        remarks: string | null;
    }[];
}

interface Props {
    vendors: Vendor[];
    items: Item[];
    purchaseOrder?: PurchaseOrder;
}

function QuickCreateVendorDialog({
    open,
    onClose,
    onCreated,
}: {
    open: boolean;
    onClose: () => void;
    onCreated: (vendor: Vendor) => void;
}) {
    const { data, setData, post, processing, errors, reset } = useHttp<{
        name: string;
        email: string;
        phone: string;
        contact_person: string;
    }>({
        name: '',
        email: '',
        phone: '',
        contact_person: '',
    });

    const submit = (event: React.FormEvent): void => {
        event.preventDefault();

        post(vendors.store.url(), {
            onSuccess: (response: any) => {
                const vendor = response.data || response;
                onCreated({ id: vendor.id, name: vendor.name });
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Vendor</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4 pt-2">
                    <Field>
                        <FieldLabel htmlFor="quick-vendor-name">
                            Name
                        </FieldLabel>
                        <Input
                            id="quick-vendor-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoFocus
                        />
                        <FieldError errors={[{ message: errors.name }]} />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="quick-vendor-contact">
                            Contact Person
                        </FieldLabel>
                        <Input
                            id="quick-vendor-contact"
                            value={data.contact_person}
                            onChange={(e) =>
                                setData('contact_person', e.target.value)
                            }
                        />
                        <FieldError
                            errors={[{ message: errors.contact_person }]}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="quick-vendor-email">
                            Email
                        </FieldLabel>
                        <Input
                            id="quick-vendor-email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <FieldError errors={[{ message: errors.email }]} />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="quick-vendor-phone">
                            Phone
                        </FieldLabel>
                        <Input
                            id="quick-vendor-phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                        />
                        <FieldError errors={[{ message: errors.phone }]} />
                    </Field>

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
                            {processing ? 'Creating…' : 'Create Vendor'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function PurchaseForm({
    vendors: initialVendors,
    items,
    purchaseOrder,
}: Props) {
    const isEdit = !!purchaseOrder;
    const [vendorList, setVendorList] = useState<Vendor[]>(initialVendors);
    const [showVendorDialog, setShowVendorDialog] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        vendor_id: purchaseOrder?.vendor_id?.toString() ?? '',
        expected_date: purchaseOrder?.expected_date ?? '',
        discount: purchaseOrder?.discount ?? '0',
        tax: purchaseOrder?.tax ?? '0',
        shipping: purchaseOrder?.shipping ?? '0',
        notes: purchaseOrder?.notes ?? '',
        items: purchaseOrder?.items?.map((item) => ({
            item_id: item.item_id.toString(),
            quantity_ordered: item.quantity_ordered.toString(),
            unit_cost: item.unit_cost.toString(),
            discount: item.discount?.toString() ?? '0',
            tax: item.tax?.toString() ?? '0',
            remarks: item.remarks ?? '',
        })) ?? [
            {
                item_id: '',
                quantity_ordered: '',
                unit_cost: '',
                discount: '0',
                tax: '0',
                remarks: '',
            },
        ],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(purchases.update({ purchase_order: purchaseOrder!.id }).url);

            return;
        }

        post(purchases.store.url());
    };

    const addItem = () => {
        setData('items', [
            ...data.items,
            {
                item_id: '',
                quantity_ordered: '',
                unit_cost: '',
                discount: '0',
                tax: '0',
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
        key: keyof PurchaseItemForm,
        value: string,
    ) => {
        const newItems = [...data.items];
        newItems[index][key] = value;
        setData('items', newItems);
    };

    const selectedItems = data.items.map((i) => i.item_id);

    const lineTotal = (item: PurchaseItemForm) => {
        const qty = parseFloat(item.quantity_ordered) || 0;
        const cost = parseFloat(item.unit_cost) || 0;
        const disc = parseFloat(item.discount) || 0;
        const tax = parseFloat(item.tax) || 0;

        return qty * cost - disc + tax;
    };

    const subtotal = useMemo(
        () => data.items.reduce((sum, item) => sum + lineTotal(item), 0),
        [data.items],
    );

    const grandTotal = useMemo(() => {
        const disc = parseFloat(data.discount) || 0;
        const tax = parseFloat(data.tax) || 0;
        const shipping = parseFloat(data.shipping) || 0;

        return subtotal - disc + tax + shipping;
    }, [subtotal, data.discount, data.tax, data.shipping]);

    const handleVendorCreated = (vendor: Vendor) => {
        setVendorList((prev) => [...prev, vendor]);
        setData('vendor_id', vendor.id.toString());
    };

    return (
        <>
            <form onSubmit={submit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <Field>
                            <FieldLabel>Vendor</FieldLabel>
                            <div className="flex gap-2">
                                <Select
                                    value={data.vendor_id}
                                    onValueChange={(value) =>
                                        setData('vendor_id', value)
                                    }
                                >
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Select vendor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vendorList.map((vendor) => (
                                            <SelectItem
                                                key={vendor.id}
                                                value={vendor.id.toString()}
                                            >
                                                {vendor.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setShowVendorDialog(true)}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <FieldError
                                errors={[{ message: errors.vendor_id }]}
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Expected Date</FieldLabel>
                            <Input
                                type="date"
                                value={data.expected_date}
                                onChange={(e) =>
                                    setData('expected_date', e.target.value)
                                }
                            />
                            <FieldError
                                errors={[{ message: errors.expected_date }]}
                            />
                        </Field>

                        <Field className="md:col-span-2">
                            <FieldLabel>Notes</FieldLabel>
                            <Textarea
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                                rows={3}
                            />
                            <FieldError errors={[{ message: errors.notes }]} />
                        </Field>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Items</CardTitle>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addItem}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Item
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {(errors as any)['items'] && (
                            <p className="mb-4 text-sm text-destructive">
                                {(errors as any)['items']}
                            </p>
                        )}
                        <div className="space-y-4">
                            {data.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-12 items-end gap-3 rounded-lg border p-4"
                                >
                                    <div className="col-span-3">
                                        <FieldLabel>Item</FieldLabel>
                                        <Select
                                            value={item.item_id}
                                            onValueChange={(value) =>
                                                updateItem(
                                                    index,
                                                    'item_id',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select item" />
                                            </SelectTrigger>
                                            <SelectContent className="w-full">
                                                {items
                                                    .filter(
                                                        (i) =>
                                                            !selectedItems.includes(
                                                                i.id.toString(),
                                                            ) ||
                                                            i.id.toString() ===
                                                                item.item_id,
                                                    )
                                                    .map((i) => (
                                                        <SelectItem
                                                            key={i.id}
                                                            value={i.id.toString()}
                                                        >
                                                            {i.sku} — {i.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldError
                                            errors={[
                                                {
                                                    message: (errors as any)[
                                                        `items.${index}.item_id`
                                                    ],
                                                },
                                            ]}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <FieldLabel>Quantity</FieldLabel>
                                        <Input
                                            type="number"
                                            step="any"
                                            min="0"
                                            value={item.quantity_ordered}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    'quantity_ordered',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <FieldError
                                            errors={[
                                                {
                                                    message: (errors as any)[
                                                        `items.${index}.quantity_ordered`
                                                    ],
                                                },
                                            ]}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <FieldLabel>Unit Cost</FieldLabel>
                                        <Input
                                            type="number"
                                            step="any"
                                            min="0"
                                            value={item.unit_cost}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    'unit_cost',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <FieldError
                                            errors={[
                                                {
                                                    message: (errors as any)[
                                                        `items.${index}.unit_cost`
                                                    ],
                                                },
                                            ]}
                                        />
                                    </div>

                                    <div className="col-span-1">
                                        <FieldLabel>Discount</FieldLabel>
                                        <Input
                                            type="number"
                                            step="any"
                                            min="0"
                                            value={item.discount}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    'discount',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="col-span-1">
                                        <FieldLabel>Tax</FieldLabel>
                                        <Input
                                            type="number"
                                            step="any"
                                            min="0"
                                            value={item.tax}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    'tax',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <FieldLabel>Line Total</FieldLabel>
                                        <Input
                                            readOnly
                                            value={lineTotal(item).toFixed(2)}
                                            className="bg-muted"
                                        />
                                    </div>

                                    <div className="col-span-1 flex justify-end">
                                        {data.items.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    removeItem(index)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Order Totals</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-4">
                        <Field>
                            <FieldLabel>Subtotal</FieldLabel>
                            <Input
                                readOnly
                                value={subtotal.toFixed(2)}
                                className="bg-muted"
                            />
                        </Field>
                        <Field>
                            <FieldLabel>Discount</FieldLabel>
                            <Input
                                type="number"
                                step="any"
                                min="0"
                                value={data.discount}
                                onChange={(e) =>
                                    setData('discount', e.target.value)
                                }
                            />
                        </Field>
                        <Field>
                            <FieldLabel>Tax</FieldLabel>
                            <Input
                                type="number"
                                step="any"
                                min="0"
                                value={data.tax}
                                onChange={(e) => setData('tax', e.target.value)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel>Shipping</FieldLabel>
                            <Input
                                type="number"
                                step="any"
                                min="0"
                                value={data.shipping}
                                onChange={(e) =>
                                    setData('shipping', e.target.value)
                                }
                            />
                        </Field>
                        <Field className="md:col-span-4">
                            <div className="flex items-center justify-end gap-2 text-lg font-semibold">
                                <span>Grand Total:</span>
                                <span>{grandTotal.toFixed(2)}</span>
                            </div>
                        </Field>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" asChild>
                        <Link href={purchases.index()}>Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {isEdit
                            ? 'Update Purchase Order'
                            : 'Create Purchase Order'}
                    </Button>
                </div>
            </form>

            <QuickCreateVendorDialog
                open={showVendorDialog}
                onClose={() => setShowVendorDialog(false)}
                onCreated={handleVendorCreated}
            />
        </>
    );
}
