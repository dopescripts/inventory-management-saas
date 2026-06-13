import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SuperAdminLayout from '@/layouts/super-admin/layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const RootLayout = ({ children }: { children: React.ReactNode }) => (
    <>
        {children}
        <Toaster />
    </>
);

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        let pageLayout;
        switch (true) {
            case name === 'welcome':
                pageLayout = null;
                break;
            case name.startsWith('auth/') || name.startsWith('super-admin/auth'):
                pageLayout = AuthLayout;
                break;
            case name.startsWith('settings/'):
                pageLayout = [AppLayout, SettingsLayout];
                break;
            case name.startsWith('super-admin/'):
                pageLayout = SuperAdminLayout;
                break;
            default:
                pageLayout = AppLayout;
                break;
        }

        if (pageLayout === null) return RootLayout;
        if (Array.isArray(pageLayout)) return [RootLayout, ...pageLayout];
        return [RootLayout, pageLayout];
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
