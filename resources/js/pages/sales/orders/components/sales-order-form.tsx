import { useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import orders from '@/routes/orders';

interface Customer {
    id: number;
    name: string;
    company_name: string | null;
}

interface Warehouse {
    id: number;
    name: string;
}

interface Item {
    id: number;
    name: string;
    sku: string | null;
}

interface OrderItem {
    item_id: number | string;
    ordered_quantity: number | string;
    unit_price: number | string;
}

interface SalesOrder {
    id: number;
    customer_id: number;
    warehouse_id: number;
    order_date: string;
    expected_ship_date: string | null;
    notes: string | null;
    items: Array<{
        item_id: number;
        ordered_quantity: string | number;
        unit_price: string | number;
    }>;
}

interface Props {
    customers: Customer[];
    warehouses: Warehouse[];
    items: Item[];
    salesOrder?: SalesOrder;
}

export default function SalesOrderForm({ customers, warehouses, items, salesOrder }: Props) {
    const isEdit = !!salesOrder;

    const { data, setData, post, put, processing, errors } = useForm({
        customer_id: salesOrder?.customer_id?.toString() ?? '',
        warehouse_id: salesOrder?.warehouse_id?.toString() ?? '',
        order_date: salesOrder?.order_date ? salesOrder.order_date.slice(0, 10) : new Date().toISOString().slice(0, 10),
        expected_ship_date: salesOrder?.expected_ship_date ? salesOrder.expected_ship_date.slice(0, 10) : '',
        notes: salesOrder?.notes ?? '',
        items: salesOrder?.items?.map((i) => ({
            item_id: i.item_id.toString(),
            ordered_quantity: i.ordered_quantity.toString(),
            unit_price: i.unit_price.toString(),
        })) ?? [{ item_id: '', ordered_quantity: '', unit_price: '' }],
    });

    const addItem = () => {
        setData('items', [...data.items, { item_id: '', ordered_quantity: '', unit_price: '' }]);
    };

    const removeItem = (index: number) => {
        setData('items', data.items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: keyof OrderItem, value: string) => {
        const updated = data.items.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setData('items', updated);
    };

    const lineTotal = (item: OrderItem) => {
        const qty = parseFloat(item.ordered_quantity as string) || 0;
        const price = parseFloat(item.unit_price as string) || 0;
        return (qty * price).toFixed(2);
    };

    const orderTotal = data.items.reduce((sum, item) => {
        return sum + (parseFloat(item.ordered_quantity as string) || 0) * (parseFloat(item.unit_price as string) || 0);
    }, 0);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(orders.update({ order: salesOrder!.id }).url);
        } else {
            post(orders.store.url());
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            {/* Order Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <Field>
                        <FieldLabel>Customer *</FieldLabel>
                        <Select
                            value={data.customer_id}
                            onValueChange={(v) => setData('customer_id', v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Customer" />
                            </SelectTrigger>
                            <SelectContent>
                                {customers.map((c) => (
                                    <SelectItem key={c.id} value={c.id.toString()}>
                                        {c.name}{c.company_name ? ` (${c.company_name})` : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FieldError errors={[{ message: errors.customer_id }]} />
                    </Field>

                    <Field>
                        <FieldLabel>Warehouse *</FieldLabel>
                        <Select
                            value={data.warehouse_id}
                            onValueChange={(v) => setData('warehouse_id', v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Warehouse" />
                            </SelectTrigger>
                            <SelectContent>
                                {warehouses.map((w) => (
                                    <SelectItem key={w.id} value={w.id.toString()}>
                                        {w.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FieldError errors={[{ message: errors.warehouse_id }]} />
                    </Field>

                    <Field>
                        <FieldLabel>Order Date *</FieldLabel>
                        <Input
                            type="date"
                            value={data.order_date}
                            onChange={(e) => setData('order_date', e.target.value)}
                        />
                        <FieldError errors={[{ message: errors.order_date }]} />
                    </Field>

                    <Field>
                        <FieldLabel>Expected Ship Date</FieldLabel>
                        <Input
                            type="date"
                            value={data.expected_ship_date}
                            onChange={(e) => setData('expected_ship_date', e.target.value)}
                        />
                        <FieldError errors={[{ message: errors.expected_ship_date }]} />
                    </Field>

                    <Field className="md:col-span-2">
                        <FieldLabel>Notes</FieldLabel>
                        <Textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={3}
                        />
                        <FieldError errors={[{ message: errors.notes }]} />
                    </Field>
                </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Line Items</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                    </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                    {(errors as any).items && (
                        <p className="text-sm text-destructive">{(errors as any).items}</p>
                    )}

                    <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
                        <div className="col-span-5">Item</div>
                        <div className="col-span-2">Qty</div>
                        <div className="col-span-2">Unit Price</div>
                        <div className="col-span-2 text-right">Total</div>
                        <div className="col-span-1" />
                    </div>

                    {data.items.map((lineItem, index) => (
                        <div key={index} className="grid grid-cols-12 items-start gap-2">
                            <div className="col-span-5">
                                <Select
                                    value={lineItem.item_id}
                                    onValueChange={(v) => updateItem(index, 'item_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Item" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {items.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.name}{item.sku ? ` (${item.sku})` : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-2">
                                <Input
                                    type="number"
                                    step="0.001"
                                    min="0.001"
                                    placeholder="Qty"
                                    value={lineItem.ordered_quantity}
                                    onChange={(e) => updateItem(index, 'ordered_quantity', e.target.value)}
                                />
                            </div>
                            <div className="col-span-2">
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="Price"
                                    value={lineItem.unit_price}
                                    onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                                />
                            </div>
                            <div className="col-span-2 flex h-9 items-center justify-end text-sm font-medium">
                                {lineTotal(lineItem)}
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-destructive hover:text-destructive"
                                    onClick={() => removeItem(index)}
                                    disabled={data.items.length === 1}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    <div className="border-t pt-3">
                        <div className="flex justify-end">
                            <div className="grid grid-cols-2 gap-x-4 text-sm">
                                <span className="text-muted-foreground">Order Total</span>
                                <span className="text-right font-semibold">{orderTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
                <Button type="submit" disabled={processing}>
                    {isEdit ? 'Update Order' : 'Create Order'}
                </Button>
            </div>
        </form>
    );
}
