import { Head, Link, router, setLayoutProps } from '@inertiajs/react';
import { Building, Edit, Mail, Phone, Trash } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrency } from '@/lib/currency';
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
    customer: Customer;
}

export default function Show({ customer }: Props) {
    const { format } = useCurrency();

    setLayoutProps({
        breadcrumbs: [
            { title: 'Sales', href: '' },
            { title: 'Customers', href: customers.index() },
            {
                title: customer.name,
                href: customers.show({ customer: customer.id }),
            },
        ],
    });

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            router.delete(customers.destroy({ customer: customer.id }).url);
        }
    };

    return (
        <>
            <Head title={customer.name} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold">
                                {customer.name}
                            </h1>
                            <Badge
                                variant={
                                    customer.status === 'active'
                                        ? 'default'
                                        : 'secondary'
                                }
                            >
                                {customer.status === 'active'
                                    ? 'Active'
                                    : 'Inactive'}
                            </Badge>
                        </div>
                        {customer.company_name && (
                            <p className="mt-1 flex items-center text-muted-foreground">
                                <Building className="mr-2 h-4 w-4" />
                                {customer.company_name}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link
                                href={
                                    customers.edit({ customer: customer.id })
                                        .url
                                }
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {customer.email && (
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{customer.email}</span>
                                </div>
                            )}
                            {customer.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{customer.phone}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Financial Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {customer.tax_number && (
                                <div className="grid grid-cols-2">
                                    <span className="font-semibold text-muted-foreground">
                                        Tax Number
                                    </span>
                                    <span>{customer.tax_number}</span>
                                </div>
                            )}
                            {customer.payment_terms && (
                                <div className="grid grid-cols-2">
                                    <span className="font-semibold text-muted-foreground">
                                        Payment Terms
                                    </span>
                                    <span>{customer.payment_terms}</span>
                                </div>
                            )}
                            {customer.credit_limit && (
                                <div className="grid grid-cols-2">
                                    <span className="font-semibold text-muted-foreground">
                                        Credit Limit
                                    </span>
                                    <span>{format(customer.credit_limit)}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Billing Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {customer.billing_address ? (
                                <p className="whitespace-pre-wrap">
                                    {customer.billing_address}
                                </p>
                            ) : (
                                <p className="text-muted-foreground italic">
                                    No billing address provided.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {customer.shipping_address ? (
                                <p className="whitespace-pre-wrap">
                                    {customer.shipping_address}
                                </p>
                            ) : (
                                <p className="text-muted-foreground italic">
                                    No shipping address provided.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {customer.notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">
                                {customer.notes}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}
