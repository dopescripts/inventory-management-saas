import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';

export default function WelcomeStep() {
    return (
        <div className="space-y-8 text-center">
            <div className="flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
            </div>

            <div className="space-y-2">
                <h2 className="text-2xl font-bold">You're all set!</h2>
                <p className="text-muted-foreground">
                    Your account is ready. Start managing your inventory, track
                    purchases, and grow your business.
                </p>
            </div>

            <Button asChild size="lg" className="w-full">
                <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
        </div>
    );
}
