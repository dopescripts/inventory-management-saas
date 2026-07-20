import { usePage } from '@inertiajs/react';
import type { Currency } from '@/types/auth';

export function formatCurrency(
    amount: number | string,
    currency?: Currency | null,
): string {
    const page = usePage<{
        auth: { tenant: { currency: Currency | null } | null };
    }>();
    const curr = currency ?? page.props.auth?.tenant?.currency;
    const decimals = curr?.decimal_places ?? 2;
    const symbol = curr?.symbol ?? '$';

    return `${symbol}${Number(amount).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })}`;
}

export function useCurrency() {
    const page = usePage<{
        auth: { tenant: { currency: Currency | null } | null };
    }>();
    const currency = page.props.auth?.tenant?.currency ?? null;

    return {
        currency,
        format: (amount: number | string) => {
            const decimals = currency?.decimal_places ?? 2;
            const symbol = currency?.symbol ?? '$';

            return `${symbol}${Number(amount).toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            })}`;
        },
    };
}
