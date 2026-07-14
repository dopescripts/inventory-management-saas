import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import warehouses from '@/routes/warehouses';

export default function Create({ warehouse }: { warehouse: any }) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        zone: '',
        aisle: '',
        rack: '',
        shelf: '',
        bin: '',
        description: '',
        is_active: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(warehouses.locations.store({ warehouse: warehouse.id }));
    };

    return (
        <>
            <Head title={`Add Location - ${warehouse.name}`} />

            <div className="mx-auto flex h-full w-full max-w-2xl flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Add Location</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Create a new storage location in {warehouse.name}.
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="code">
                                    Location Code{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="code"
                                    value={data.code}
                                    onChange={(e) =>
                                        setData('code', e.target.value)
                                    }
                                    placeholder="e.g. A-01-01-01"
                                    required
                                />
                                <InputError message={errors.code} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="zone">Zone</Label>
                                    <Input
                                        id="zone"
                                        value={data.zone}
                                        onChange={(e) =>
                                            setData('zone', e.target.value)
                                        }
                                        placeholder="e.g. A"
                                    />
                                    <InputError message={errors.zone} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="aisle">Aisle</Label>
                                    <Input
                                        id="aisle"
                                        value={data.aisle}
                                        onChange={(e) =>
                                            setData('aisle', e.target.value)
                                        }
                                        placeholder="e.g. 01"
                                    />
                                    <InputError message={errors.aisle} />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="rack">Rack</Label>
                                    <Input
                                        id="rack"
                                        value={data.rack}
                                        onChange={(e) =>
                                            setData('rack', e.target.value)
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="shelf">Shelf</Label>
                                    <Input
                                        id="shelf"
                                        value={data.shelf}
                                        onChange={(e) =>
                                            setData('shelf', e.target.value)
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="bin">Bin</Label>
                                    <Input
                                        id="bin"
                                        value={data.bin}
                                        onChange={(e) =>
                                            setData('bin', e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Optional description"
                                />
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) =>
                                        setData('is_active', checked)
                                    }
                                />
                                <Label
                                    htmlFor="is_active"
                                    className="cursor-pointer"
                                >
                                    Active Location
                                </Label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t pt-4">
                            <Button type="button" variant="outline" asChild>
                                <Link
                                    href={warehouses.show({
                                        warehouse: warehouse.id,
                                    })}
                                >
                                    Cancel
                                </Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Create Location
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

const CreateLayout = ({ children }: { children: React.ReactNode }) => {
    const { warehouse } = usePage<any>().props;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Warehouses', href: warehouses.index() },
                {
                    title: warehouse?.name || 'Details',
                    href: warehouses.show({ warehouse: warehouse?.id }),
                },
                {
                    title: 'Locations',
                    href: warehouses.show({ warehouse: warehouse?.id }),
                },
                { title: 'Create', href: '' },
            ]}
        >
            {children}
        </AppLayout>
    );
};

Create.layout = (page: React.ReactNode) => <CreateLayout>{page}</CreateLayout>;
