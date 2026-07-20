import { Head, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import Heading from '@/components/heading';
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
import { Textarea } from '@/components/ui/textarea';
import { edit, update } from '@/routes/currency';
import type { Auth } from '@/types';

interface Currency {
    id: number;
    code: string;
    name: string;
    symbol: string;
}

type PageProps = {
    auth: Auth;
    currencies: Currency[];
    currentCurrencyId: number | null;
    billingAddress: string | null;
    billingPhone: string | null;
    billingEmail: string | null;
    taxId: string | null;
};

export default function CurrencySettings() {
    const {
        currencies,
        currentCurrencyId,
        billingAddress,
        billingPhone,
        billingEmail,
        taxId,
        auth,
    } = usePage<PageProps>().props;

    const canEdit =
        auth.user?.roles?.some((r) => r === 'owner' || r === 'manager') ??
        false;

    const { data, setData, patch, processing, errors, recentlySuccessful } =
        useForm({
            default_currency_id: currentCurrencyId?.toString() ?? '',
            billing_address: billingAddress ?? '',
            billing_phone: billingPhone ?? '',
            billing_email: billingEmail ?? '',
            tax_id: taxId ?? '',
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(update.url());
    };

    return (
        <>
            <Head title="Currency & Billing" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Currency & Billing"
                    description="Configure your default currency and billing information for invoices"
                />

                <form onSubmit={submit} className="space-y-6">
                    <Field>
                        <FieldLabel>Default Currency</FieldLabel>
                        <Select
                            value={data.default_currency_id}
                            onValueChange={(value) =>
                                setData('default_currency_id', value)
                            }
                            disabled={!canEdit}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map((currency) => (
                                    <SelectItem
                                        key={currency.id}
                                        value={currency.id.toString()}
                                    >
                                        {currency.symbol} — {currency.name} (
                                        {currency.code})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FieldError
                            errors={[{ message: errors.default_currency_id }]}
                        />
                    </Field>

                    <div className="border-t pt-6">
                        <h3 className="text-sm font-medium">
                            Billing Information
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            This information appears on generated invoices and
                            bills.
                        </p>
                    </div>

                    <Field>
                        <FieldLabel>Billing Email</FieldLabel>
                        <Input
                            type="email"
                            value={data.billing_email}
                            onChange={(e) =>
                                setData('billing_email', e.target.value)
                            }
                            disabled={!canEdit}
                            placeholder="billing@company.com"
                        />
                        <FieldError
                            errors={[{ message: errors.billing_email }]}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Billing Phone</FieldLabel>
                        <Input
                            value={data.billing_phone}
                            onChange={(e) =>
                                setData('billing_phone', e.target.value)
                            }
                            disabled={!canEdit}
                            placeholder="+1 234 567 890"
                        />
                        <FieldError
                            errors={[{ message: errors.billing_phone }]}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Tax ID / VAT Number</FieldLabel>
                        <Input
                            value={data.tax_id}
                            onChange={(e) => setData('tax_id', e.target.value)}
                            disabled={!canEdit}
                            placeholder="e.g. GB123456789"
                        />
                        <FieldError errors={[{ message: errors.tax_id }]} />
                    </Field>

                    <Field>
                        <FieldLabel>Billing Address</FieldLabel>
                        <Textarea
                            value={data.billing_address}
                            onChange={(e) =>
                                setData('billing_address', e.target.value)
                            }
                            disabled={!canEdit}
                            rows={3}
                            placeholder="Street, City, State, ZIP, Country"
                        />
                        <FieldError
                            errors={[{ message: errors.billing_address }]}
                        />
                    </Field>

                    {canEdit && (
                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving…' : 'Save Changes'}
                            </Button>
                            {recentlySuccessful && (
                                <p className="text-sm text-muted-foreground">
                                    Saved.
                                </p>
                            )}
                        </div>
                    )}

                    {!canEdit && (
                        <p className="text-sm text-muted-foreground">
                            Only owners and managers can update currency and
                            billing settings.
                        </p>
                    )}
                </form>
            </div>
        </>
    );
}

CurrencySettings.layout = {
    breadcrumbs: [
        {
            title: 'Currency & Billing settings',
            href: edit(),
        },
    ],
};
