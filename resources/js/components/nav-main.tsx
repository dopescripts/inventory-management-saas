import { Link, usePage } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavGroup } from '@/types';
import { ChevronRight } from 'lucide-react';

export function NavMain({ navGroups = [] }: { navGroups: NavGroup[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    const { auth } = usePage().props as any;
    const hasPermission = (permission: string) => auth.user.permissions.includes(permission);

    return (
        <>
            {navGroups.map((item) => (
                <Collapsible
                    key={item.title}
                    title={item.title}
                    defaultOpen
                    className="group/collapsible"
                >
                    <SidebarGroup>
                        <SidebarGroupLabel
                            asChild
                            className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                            <CollapsibleTrigger className='cursor-pointer'>
                                {item.title}{" "}
                                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent className='mt-1'>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {item.items.map((item) => {
                                        if (item.permission && !hasPermission(item.permission)) {
                                            return null;
                                        }

                                        return (

                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={isCurrentUrl(item.href)}
                                                    tooltip={{ children: item.title }}
                                                >
                                                    <Link href={item.href} prefetch>
                                                        {item.icon && <item.icon />}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>
            ))}
        </>
    );
}
