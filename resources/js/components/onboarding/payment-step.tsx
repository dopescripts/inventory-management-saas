import { useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

interface Props {
    planName: string;
    planPrice: string;
}

export default function PaymentStep({ planName, planPrice }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        card_number: '',
        expiry: '',
        cvv: '',
        card_holder: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/onboarding/payment');
    };

    const price = parseFloat(planPrice);

    if (price === 0) {
        return (
            <div className="space-y-6 text-center">
                <div className="rounded-lg border bg-muted/30 p-6">
                    <h3 className="text-lg font-semibold">Free Plan Selected</h3>
                    <p className="mt-2 text-muted-foreground">
                        No payment required for the {planName} plan.
                    </p>
                </div>
                <form onSubmit={submit}>
                    <Button type="submit" className="w-full" disabled={processing}>
                        {processing && <Spinner />}
                        Complete Setup
                    </Button>
                </form>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                    <span className="font-medium">{planName}</span>
                    <span className="text-lg font-bold">
                        ${price.toFixed(2)}/month
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="card_holder">Cardholder Name</Label>
                    <Input
                        id="card_holder"
                        value={data.card_holder}
                        onChange={(e) => setData('card_holder', e.target.value)}
                        placeholder="John Doe"
                        required
                    />
                    <InputError message={errors.card_holder} />

                </div>

                <div className="grid gap-2">
                    <Label htmlFor="card_number">Card Number</Label>
                    <Input
                        id="card_number"
                        value={data.card_number}
                        onChange={(e) => setData('card_number', e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        required
                    />
                    <InputError message={errors.card_number} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="expiry">Expiry</Label>
                        <Input
                            id="expiry"
                            value={data.expiry}
                            onChange={(e) =>
                                setData('expiry', e.target.value)
                            }
                            placeholder="MM/YY"
                            maxLength={5}
                            required
                        />
                        <InputError message={errors.expiry} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                            id="cvv"
                            value={data.cvv}
                            onChange={(e) => setData('cvv', e.target.value)}
                            placeholder="123"
                            maxLength={4}
                            required
                        />
                        <InputError message={errors.cvv} />
                    </div>
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={processing}>
                {processing && <Spinner />}
                Pay ${price.toFixed(2)} & Complete Setup
            </Button>

            <p className="text-center text-xs text-muted-foreground">
                Your payment is processed securely. You can cancel anytime.
            </p>
        </form>
    );
}
