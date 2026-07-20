import { useForm } from '@inertiajs/react';
import React from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import customers from '@/routes/customers';

interface Customer {
    id: number;
    name: string;
    company_name: string | null;
    email: string | null;
    phone: string | null;
    tax_number: string | null;
    billing_address: string | null;
    shipping_address: string | null;
    credit_limit: number | string | null;
    payment_terms: string | null;
    status: string;
    notes: string | null;
}

interface Props {
    customer?: Customer;
}

export default function CustomerForm({ customer }: Props) {
    const isEdit = !!customer;

    const { data, setData, post, put, processing, errors } = useForm({
        name: customer?.name ?? '',
        company_name: customer?.company_name ?? '',
        email: customer?.email ?? '',
        phone: customer?.phone ?? '',
        tax_number: customer?.tax_number ?? '',
        billing_address: customer?.billing_address ?? '',
        shipping_address: customer?.shipping_address ?? '',
        credit_limit: customer?.credit_limit ?? '',
        payment_terms: customer?.payment_terms ?? '',
        status: customer?.status ?? 'active',
        notes: customer?.notes ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(customers.update({ customer: customer!.id }).url);

            return;
        }

        post(customers.store.url());
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-4 md:grid-cols-2">
                    <Field>
                        <FieldLabel>Name *</FieldLabel>
                        <Input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <FieldError errors={[{ message: errors.name }]} />
                    </Field>

                    <Field>
                        <FieldLabel>Company Name</FieldLabel>
                        <Input
                            value={data.company_name}
                            onChange={(e) =>
                                setData('company_name', e.target.value)
                            }
                        />
                        <FieldError
                            errors={[{ message: errors.company_name }]}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Email</FieldLabel>
                        <Input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <FieldError errors={[{ message: errors.email }]} />
                    </Field>

                    <Field>
                        <FieldLabel>Phone</FieldLabel>
                        <Input
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                        />
                        <FieldError errors={[{ message: errors.phone }]} />
                    </Field>

                    <Field>
                        <FieldLabel>Tax Number</FieldLabel>
                        <Input
                            value={data.tax_number}
                            onChange={(e) =>
                                setData('tax_number', e.target.value)
                            }
                        />
                        <FieldError errors={[{ message: errors.tax_number }]} />
                    </Field>

                    <Field>
                        <FieldLabel>Status</FieldLabel>
                        <Select
                            value={data.status}
                            onValueChange={(value) => setData('status', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                    Inactive
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <FieldError errors={[{ message: errors.status }]} />
                    </Field>

                    <Field className="md:col-span-2">
                        <FieldLabel>Billing Address</FieldLabel>
                        <Textarea
                            value={data.billing_address}
                            onChange={(e) =>
                                setData('billing_address', e.target.value)
                            }
                            rows={3}
                        />
                        <FieldError
                            errors={[{ message: errors.billing_address }]}
                        />
                    </Field>

                    <Field className="md:col-span-2">
                        <FieldLabel>Shipping Address</FieldLabel>
                        <Textarea
                            value={data.shipping_address}
                            onChange={(e) =>
                                setData('shipping_address', e.target.value)
                            }
                            rows={3}
                        />
                        <FieldError
                            errors={[{ message: errors.shipping_address }]}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Credit Limit</FieldLabel>
                        <Input
                            type="number"
                            step="0.01"
                            value={data.credit_limit}
                            onChange={(e) =>
                                setData('credit_limit', e.target.value)
                            }
                        />
                        <FieldError
                            errors={[{ message: errors.credit_limit }]}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Payment Terms</FieldLabel>
                        <Input
                            placeholder="e.g. Net 30"
                            value={data.payment_terms}
                            onChange={(e) =>
                                setData('payment_terms', e.target.value)
                            }
                        />
                        <FieldError
                            errors={[{ message: errors.payment_terms }]}
                        />
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

            <div className="flex justify-end gap-3">
                <Button type="submit" disabled={processing}>
                    {isEdit ? 'Update Customer' : 'Create Customer'}
                </Button>
            </div>
        </form>
    );
}
