import SuperAdminShell from '@/layouts/super-admin/shell';
import type { BreadcrumbItem } from '@/types';
import { PropsWithChildren } from 'react';

interface SuperAdminLayoutProps extends PropsWithChildren {
    breadcrumbs?: BreadcrumbItem[];
}

export default function SuperAdminLayout({
    children,
    breadcrumbs = [],
}: SuperAdminLayoutProps) {
    return (
        <SuperAdminShell breadcrumbs={breadcrumbs}>
            {children}
        </SuperAdminShell>
    );
}