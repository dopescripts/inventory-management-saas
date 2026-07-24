import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Building2,
    ShieldCheck,
    CreditCard,
    Receipt,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/super-admin/nav-main';
import { SuperAdminNavUser } from '@/components/super-admin/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

// We'll use hardcoded URLs for now if Wayfinder imports are tricky,
// but ideally we use the generated actions.
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/super-admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Plans',
        href: '/super-admin/plans',
        icon: ShieldCheck,
    },
    {
        title: 'Tenants',
        href: '/super-admin/tenants',
        icon: Building2,
    },
    {
        title: 'Subscriptions',
        href: '/super-admin/subscriptions',
        icon: CreditCard,
    },
    {
        title: 'Payments',
        href: '/super-admin/payments',
        icon: Receipt,
    },
    // {
    //     title: 'Admins',
    //     href: '/super-admin/admins',
    //     icon: Users,
    // },
];

export function SuperAdminSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/super-admin/dashboard" prefetch>
                                <AppLogo />
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">
                                        Super Admin
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Control Panel
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <SuperAdminNavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
