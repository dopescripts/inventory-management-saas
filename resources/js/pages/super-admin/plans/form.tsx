import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

interface Props {
    form: any;
    submit: (e: React.FormEvent) => void;
}

export default function PlanForm({ form, submit }: Props) {
    const { data, setData, processing, errors } = form;

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="name">Plan Name</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="e.g. Starter Plan"
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                    />
                    <InputError message={errors.price} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="max_warehouses">
                        Max Warehouses (-1 for unlimited)
                    </Label>
                    <Input
                        id="max_warehouses"
                        type="number"
                        value={data.max_warehouses}
                        onChange={(e) =>
                            setData('max_warehouses', parseInt(e.target.value))
                        }
                    />
                    <InputError message={errors.max_warehouses} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="max_items">
                        Max Items (-1 for unlimited)
                    </Label>
                    <Input
                        id="max_items"
                        type="number"
                        value={data.max_items}
                        onChange={(e) =>
                            setData('max_items', parseInt(e.target.value))
                        }
                    />
                    <InputError message={errors.max_items} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="max_orders">
                        Max Orders/Month (-1 for unlimited)
                    </Label>
                    <Input
                        id="max_orders"
                        type="number"
                        value={data.max_orders}
                        onChange={(e) =>
                            setData('max_orders', parseInt(e.target.value))
                        }
                    />
                    <InputError message={errors.max_orders} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="trial_days">Trial Days</Label>
                    <Input
                        id="trial_days"
                        type="number"
                        value={data.trial_days}
                        onChange={(e) =>
                            setData('trial_days', parseInt(e.target.value))
                        }
                    />
                    <InputError message={errors.trial_days} />
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="has_whatsapp"
                    checked={data.has_whatsapp}
                    onCheckedChange={(checked) =>
                        setData('has_whatsapp', !!checked)
                    }
                />
                <Label htmlFor="has_whatsapp">Include WhatsApp Features</Label>
                <InputError message={errors.has_whatsapp} />
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                    {processing && <Spinner className="mr-2" />}
                    Save Plan
                </Button>
            </div>
        </form>
    );
}
