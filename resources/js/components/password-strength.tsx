import { Check, X } from 'lucide-react';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
    password?: string;
    className?: string;
}

export function PasswordStrength({
    password = '',
    className,
}: PasswordStrengthProps) {
    const rules = useMemo(() => {
        return [
            {
                label: 'At least 12 characters',
                met: password.length >= 12,
            },
            {
                label: 'One uppercase letter',
                met: /[A-Z]/.test(password),
            },
            {
                label: 'One lowercase letter',
                met: /[a-z]/.test(password),
            },
            {
                label: 'One number',
                met: /[0-9]/.test(password),
            },
            {
                label: 'One symbol',
                met: /[^A-Za-z0-9]/.test(password),
            },
        ];
    }, [password]);

    if (!password) {
        return null;
    }

    return (
        <div className={cn('mt-3 space-y-2', className)}>
            <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                {rules.map((rule, i) => (
                    <div
                        key={i}
                        className={cn(
                            'flex items-center gap-2 transition-colors',
                            rule.met
                                ? 'text-green-600 dark:text-green-500'
                                : 'text-muted-foreground',
                        )}
                    >
                        {rule.met ? (
                            <Check className="size-4" />
                        ) : (
                            <X className="size-4" />
                        )}
                        <span>{rule.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
