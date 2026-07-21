import { Eye, EyeOff } from 'lucide-react';
import type { ComponentProps, Ref } from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { PasswordStrength } from './password-strength';

export default function PasswordInput({
    className,
    ref,
    showStrength = false,
    ...props
}: Omit<ComponentProps<'input'>, 'type'> & {
    ref?: Ref<HTMLInputElement>;
    showStrength?: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(
        props.defaultValue || '',
    );

    return (
        <div className={cn('w-full', className)}>
            <div className="relative">
                <Input
                    type={showPassword ? 'text' : 'password'}
                    className="pr-10"
                    ref={ref}
                    {...props}
                    onChange={(e) => {
                        setInternalValue(e.target.value);
                        props.onChange?.(e);
                    }}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-3 text-muted-foreground hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-none"
                    aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                    }
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <EyeOff className="size-4" />
                    ) : (
                        <Eye className="size-4" />
                    )}
                </button>
            </div>
            {showStrength && (
                <PasswordStrength
                    password={(props.value as string) ?? internalValue}
                />
            )}
        </div>
    );
}
