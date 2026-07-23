import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const page = usePage();
    const { name, auth } = page.props;
    const companyName = auth?.tenant?.name;
    const companyLogo = auth?.tenant?.logo;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md bg-background text-sidebar-primary-foreground">
                {companyLogo ? (
                    <img
                        src={companyLogo}
                        alt={companyName as string}
                        className="size-full object-cover"
                    />
                ) : (
                    <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                )}
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm leading-tight text-gray-300">
                <span className='truncate font-bold text-white text-xl'>
                    {name as string}
                </span>
                <span className="truncate">
                    {companyName as string}
                </span>

            </div>
        </>
    );
}
