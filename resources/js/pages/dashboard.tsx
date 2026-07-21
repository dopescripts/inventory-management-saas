import { Head } from '@inertiajs/react';
import {
    Package,
    Building2,
    TrendingUp,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';

interface DashboardProps {
    totalItems: number;
    totalWarehouses: number;
    profitAndLoss: {
        revenue: number;
        expenses: number;
        net: number;
    };
    inventoryTrend: {
        date: string;
        quantity: number;
    }[];
}

export default function Dashboard({
    totalItems = 0,
    totalWarehouses = 0,
    profitAndLoss = { revenue: 0, expenses: 0, net: 0 },
    inventoryTrend = [],
}: DashboardProps) {
    const isProfit = profitAndLoss.net >= 0;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 md:p-6 lg:p-8">
                {/* Header Section */}
                <div className="mb-2 flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Overview
                    </h1>
                    <p className="text-muted-foreground">
                        Your business statistics and inventory trends at a
                        glance.
                    </p>
                </div>

                {/* Top Metrics Row */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Items Card */}
                    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md">
                        <div className="pointer-events-none absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 opacity-5 transition-opacity duration-500 group-hover:opacity-10">
                            <Package className="h-32 w-32" />
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Items
                            </CardTitle>
                            <div className="rounded-full bg-primary/10 p-2 text-primary">
                                <Package className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {totalItems}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Active products in catalog
                            </p>
                        </CardContent>
                    </Card>

                    {/* Warehouses Card */}
                    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md">
                        <div className="pointer-events-none absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 opacity-5 transition-opacity duration-500 group-hover:opacity-10">
                            <Building2 className="h-32 w-32" />
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Warehouses
                            </CardTitle>
                            <div className="rounded-full bg-blue-500/10 p-2 text-blue-500">
                                <Building2 className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {totalWarehouses}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Locations managing stock
                            </p>
                        </CardContent>
                    </Card>

                    {/* Revenue Card */}
                    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md">
                        <div className="pointer-events-none absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 opacity-5 transition-opacity duration-500 group-hover:opacity-10">
                            <TrendingUp className="h-32 w-32" />
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Gross Revenue
                            </CardTitle>
                            <div className="rounded-full bg-green-500/10 p-2 text-green-500">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600 dark:text-green-500">
                                $
                                {profitAndLoss.revenue.toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    },
                                )}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Total sales orders
                            </p>
                        </CardContent>
                    </Card>

                    {/* Net Profit Card */}
                    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md">
                        <div className="pointer-events-none absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 opacity-5 transition-opacity duration-500 group-hover:opacity-10">
                            <DollarSign className="h-32 w-32" />
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Net Profit
                            </CardTitle>
                            <div
                                className={`rounded-full p-2 ${isProfit ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}
                            >
                                {isProfit ? (
                                    <ArrowUpRight className="h-4 w-4" />
                                ) : (
                                    <ArrowDownRight className="h-4 w-4" />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`text-3xl font-bold ${isProfit ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500'}`}
                            >
                                $
                                {Math.abs(profitAndLoss.net).toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    },
                                )}
                                {!isProfit && (
                                    <span className="ml-1 text-lg opacity-70">
                                        (Loss)
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Revenue minus $
                                {profitAndLoss.expenses.toLocaleString()}{' '}
                                expenses
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Charts Row */}
                <div className="mt-2 grid gap-6 md:grid-cols-7">
                    {/* Inventory Trend Chart */}
                    <Card className="flex flex-col transition-shadow duration-300 hover:shadow-md md:col-span-4 lg:col-span-5">
                        <CardHeader>
                            <CardTitle>Inventory Trend</CardTitle>
                            <CardDescription>
                                Net stock movement over the last 30 days
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="min-h-[350px] flex-1 pb-4 pl-0">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                                minHeight={300}
                            >
                                <AreaChart
                                    data={inventoryTrend}
                                    margin={{
                                        top: 10,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="colorQuantity"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="hsl(var(--primary))"
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="hsl(var(--primary))"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="date"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            borderColor: 'hsl(var(--border))',
                                            borderRadius: '8px',
                                            boxShadow:
                                                '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        }}
                                        itemStyle={{
                                            color: 'hsl(var(--foreground))',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="quantity"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorQuantity)"
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Summary / Quick Actions panel */}
                    <Card className="transition-shadow duration-300 hover:shadow-md md:col-span-3 lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Financial Summary</CardTitle>
                            <CardDescription>
                                At a glance P&L breakdown
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-2 text-muted-foreground">
                                            <TrendingUp className="h-4 w-4 text-green-500" />{' '}
                                            Gross Revenue
                                        </span>
                                        <span className="font-medium text-green-600 dark:text-green-500">
                                            +$
                                            {profitAndLoss.revenue.toLocaleString(
                                                undefined,
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                },
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-2 text-muted-foreground">
                                            <TrendingUp className="h-4 w-4 rotate-180 text-rose-500" />{' '}
                                            Total Expenses
                                        </span>
                                        <span className="font-medium text-rose-600 dark:text-rose-500">
                                            -$
                                            {profitAndLoss.expenses.toLocaleString(
                                                undefined,
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                },
                                            )}
                                        </span>
                                    </div>

                                    <div className="my-4 h-px bg-border" />

                                    <div className="flex items-center justify-between font-semibold">
                                        <span>
                                            Net {isProfit ? 'Profit' : 'Loss'}
                                        </span>
                                        <span
                                            className={
                                                isProfit
                                                    ? 'text-emerald-600 dark:text-emerald-500'
                                                    : 'text-rose-600 dark:text-rose-500'
                                            }
                                        >
                                            {isProfit ? '+' : '-'}$
                                            {Math.abs(
                                                profitAndLoss.net,
                                            ).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 border-t pt-6">
                                    <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
                                        <h4 className="mb-1 text-sm font-medium text-primary">
                                            Need a detailed report?
                                        </h4>
                                        <p className="mb-3 text-xs text-muted-foreground">
                                            Check the reports section for a
                                            complete breakdown of sales,
                                            purchases, and taxes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
