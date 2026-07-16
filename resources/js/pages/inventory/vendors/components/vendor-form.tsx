import { useForm } from '@inertiajs/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import vendors from '@/routes/vendors';

interface Vendor {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    contact_person: string | null;
    notes: string | null;
    is_active: boolean;
}

interface Props {
    vendor?: Vendor;
}

export default function VendorForm({ vendor }: Props) {
    const isEdit = !!vendor;

    const { data, setData, post, put, processing, errors } = useForm({
        name: vendor?.name ?? '',
        email: vendor?.email ?? '',
        phone: vendor?.phone ?? '',
        address: vendor?.address ?? '',
        contact_person: vendor?.contact_person ?? '',
        notes: vendor?.notes ?? '',
        is_active: vendor?.is_active ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(vendors.update({ vendor: vendor!.id }).url);
            return;
        }

        post(vendors.store.url());
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Vendor Information</CardTitle>
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
                        <FieldLabel>Contact Person</FieldLabel>
                        <Input
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

                    <Field className="md:col-span-2">
                        <FieldLabel>Address</FieldLabel>
                        <Textarea
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            rows={3}
                        />
                        <FieldError errors={[{ message: errors.address }]} />
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
                    {isEdit ? 'Update Vendor' : 'Create Vendor'}
                </Button>
            </div>
        </form>
    );
}
