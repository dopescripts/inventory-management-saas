import { Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Tenant } from '@/types';

type Props = {
    tenant: Tenant | null;
    compact?: boolean;
};

export function TenantContext({ tenant, compact = false }: Props) {
    if (!tenant) {
        return null;
    }

    const planName = tenant.subscription?.plan?.name ?? 'No active plan';

    return (
        <div className="flex min-w-0 items-center gap-2 rounded-md border border-sidebar-border/70 px-2.5 py-1.5">
            <Building2 className="size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
                <p className="truncate text-sm font-medium leading-none">
                    {tenant.name}
                </p>
                {!compact && (
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                        {planName}
                    </p>
                )}
            </div>
            {compact && (
                <Badge variant="secondary" className="hidden sm:inline-flex">
                    {planName}
                </Badge>
            )}
        </div>
    );
}
