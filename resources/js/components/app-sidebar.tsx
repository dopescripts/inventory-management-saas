import { Link, usePage } from '@inertiajs/react';
import { Boxes, Building2, LayoutGrid, RotateCcw, Shapes, Tag, User } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavGroup, NavItem } from '@/types';
import staff from '@/routes/staff';
import warehouses from '@/routes/warehouses';
import brands from '@/routes/brands';
import units from '@/routes/units';
import categories from '@/routes/categories';
import items from '@/routes/items';
import adjustments from '@/routes/adjustments';

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage<any>().props;
    const isOwnerOrManager = auth.user.roles?.includes('owner') || auth.user.roles?.includes('manager');



    const mainNavItems: NavGroup[] = [
        {
            title: 'Management',
            items: [
                {
                    title: 'Dashboard',
                    href: dashboard(),
                    icon: LayoutGrid,
                },
                ...(isOwnerOrManager
                    ? [
                        {
                            title: 'Manage Staff',
                            href: staff.index(),
                            icon: User,
                        },
                    ]
                    : []),
            ]
        },
        {
            title: "Inventory",
            items: [
                {
                    title: 'Items',
                    href: items.index(),
                    icon: Boxes,
                    permission: 'view_items'
                },
                {
                    title: 'Adjustments',
                    icon: RotateCcw,
                    href: adjustments.index(),
                    permission: 'view_adjustments'
                }
            ]
        },
        {
            title: "Organization",
            items: [
                {
                    title: 'Warehouse',
                    href: warehouses.index(),
                    icon: Building2
                },
                {
                    title: 'Brands',
                    href: brands.index(),
                    icon: Tag,
                    permission: 'view_brands'
                },
                {
                    title: 'Units',
                    href: units.index(),
                    icon: Boxes,
                    permission: 'view_units'
                },
                {
                    title: 'Category',
                    href: categories.index(),
                    icon: Shapes,
                    permission: 'view_categories'
                }
            ]
        }
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain navGroups={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
