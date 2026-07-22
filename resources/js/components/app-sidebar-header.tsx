import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { TenantContext } from '@/components/tenant-context';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { Auth, BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

type PageProps = {
    auth: Auth;
};

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage<PageProps>().props;

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex min-w-0 items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="hidden max-w-xs min-w-0 gap-4 md:flex md:items-center md:justify-between">
                <TenantContext tenant={auth.tenant} compact />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="group relative h-9 w-9 cursor-pointer"
                        >
                            <Bell className="!size-5 opacity-80 group-hover:opacity-100" />
                            {(auth.user?.unread_notifications_count ?? 0) >
                                0 && (
                                <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-600"></span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80" align="end">
                        <div className="flex items-center justify-between border-b px-4 py-2">
                            <span className="text-sm font-semibold">
                                Notifications
                            </span>
                            {(auth.user?.unread_notifications_count ?? 0) >
                                0 && (
                                <Link
                                    href="/notifications/mark-all-read"
                                    method="post"
                                    as="button"
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Mark all read
                                </Link>
                            )}
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {auth.user?.recent_notifications?.length ? (
                                auth.user.recent_notifications.map(
                                    (notification: any) => (
                                        <div
                                            key={notification.id}
                                            className={cn(
                                                'border-b p-4 text-sm last:border-b-0',
                                                notification.read_at
                                                    ? 'opacity-75'
                                                    : 'bg-neutral-50 dark:bg-neutral-800/50',
                                            )}
                                        >
                                            <p>{notification.data.message}</p>
                                            <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
                                                <span>
                                                    {new Date(
                                                        notification.created_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                                {!notification.read_at && (
                                                    <Link
                                                        href={`/notifications/${notification.id}/mark-read`}
                                                        method="post"
                                                        as="button"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Mark read
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ),
                                )
                            ) : (
                                <div className="p-4 text-center text-sm text-neutral-500">
                                    No recent notifications
                                </div>
                            )}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
