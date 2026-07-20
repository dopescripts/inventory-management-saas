import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    Check,
    ArrowRight,
    Package,
    Zap,
    BarChart3,
    Users,
    Lock,
    Globe,
    TrendingUp,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
    const [scrollY, setScrollY] = useState(0);
    const [activeNav, setActiveNav] = useState('home');
    const [openFaqId, setOpenFaqId] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-secondary text-foreground">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg transition-all duration-300">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                            SF
                        </div>
                        <span className="text-lg font-bold">StockFlow</span>
                    </div>

                    <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
                        {['Features', 'How It Works', 'Pricing', 'FAQ'].map(
                            (item) => (
                                <button
                                    key={item}
                                    onClick={() => setActiveNav(item)}
                                    className={`text-sm transition-colors ${
                                        activeNav === item
                                            ? 'font-semibold text-primary'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {item}
                                </button>
                            ),
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={'/login'}>
                            <button className="cursor-pointer px-4 py-2 text-sm font-medium transition-colors hover:text-primary">
                                Sign In
                            </button>
                        </Link>
                        <Link href={'/register'}>
                            <button className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/20">
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-40 right-40 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
                    <div className="absolute bottom-40 left-40 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.div
                                className="mb-6 inline-block"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                            >
                                <div className="flex w-fit items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                                    Trusted by 500+ businesses worldwide
                                </div>
                            </motion.div>

                            <h1 className="mb-6 text-5xl leading-tight font-bold text-balance md:text-6xl lg:text-6xl">
                                Inventory Management That{' '}
                                <span className="bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
                                    Keeps Your Business Moving
                                </span>
                            </h1>

                            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                                Real-time inventory tracking across multiple
                                warehouses. Know exactly where your stock is,
                                reduce errors by 99%, and scale your business
                                with confidence.
                            </p>

                            <div className="mb-12 flex flex-col gap-4 sm:flex-row">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/20"
                                >
                                    Start Free Trial
                                    <ArrowRight className="ml-2 inline h-4 w-4" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="rounded-lg border border-border px-8 py-3 font-semibold transition-all hover:bg-muted/50"
                                >
                                    Watch Demo
                                </motion.button>
                            </div>

                            <div className="flex flex-wrap gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-accent" />
                                    <span>99.9% Uptime SLA</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-accent" />
                                    <span>24/7 Support</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-accent" />
                                    <span>No Credit Card</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Hero Dashboard Preview */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="relative"
                        >
                            <div className="relative overflow-hidden rounded-xl shadow-2xl">
                                <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
                                    <div className="w-full space-y-3 px-6">
                                        <div className="grid grid-cols-3 gap-3">
                                            {[1, 2, 3].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{
                                                        opacity: 0,
                                                        y: 10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        delay: 0.3 + i * 0.1,
                                                    }}
                                                    className="flex h-16 items-center justify-center rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm"
                                                >
                                                    <Package className="h-6 w-6 text-accent/60" />
                                                </motion.div>
                                            ))}
                                        </div>
                                        <div className="h-20 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="border-y border-border bg-muted/30 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                            Trusted by Leading Companies
                        </p>
                    </div>
                    <div className="grid grid-cols-2 items-center justify-center gap-8 md:grid-cols-3 lg:grid-cols-5">
                        {[
                            'Retail Co',
                            'Supply Inc',
                            'Logistics Pro',
                            'Trade Hub',
                            'Commerce Plus',
                        ].map((company) => (
                            <motion.div
                                key={company}
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center justify-center rounded-lg p-4 transition-colors hover:bg-muted/50"
                            >
                                <span className="text-sm font-medium text-muted-foreground">
                                    {company}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                            Powerful Features
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            Everything you need to manage inventory efficiently
                            across your entire operation
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: index * 0.1,
                                    duration: 0.5,
                                }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:bg-muted/50"
                            >
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-muted/30 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                            How It Works
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Get started in minutes with our intuitive setup
                            process
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                number: '1',
                                title: 'Connect Your Warehouses',
                                description:
                                    'Add all your warehouse locations and inventory sources',
                            },
                            {
                                number: '2',
                                title: 'Import Inventory Data',
                                description:
                                    'Upload existing inventory or start fresh with real-time tracking',
                            },
                            {
                                number: '3',
                                title: 'Set Up Permissions',
                                description:
                                    'Define user roles and access levels for your team',
                            },
                            {
                                number: '4',
                                title: 'Enable Integrations',
                                description:
                                    'Connect to your existing business systems',
                            },
                            {
                                number: '5',
                                title: 'Train Your Team',
                                description:
                                    'Quick onboarding with guided walkthroughs',
                            },
                            {
                                number: '6',
                                title: 'Monitor & Optimize',
                                description:
                                    'Track performance and receive actionable insights',
                            },
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="relative rounded-xl border border-border bg-card p-6"
                            >
                                <div className="absolute -top-4 -left-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-primary-foreground">
                                    {step.number}
                                </div>
                                <h3 className="mt-4 mb-2 text-lg font-semibold">
                                    {step.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="mb-6 text-4xl font-bold md:text-5xl">
                                Why Businesses Choose StockFlow
                            </h2>
                            <p className="mb-8 text-lg text-muted-foreground">
                                From small retailers to enterprise warehouses,
                                thousands of businesses rely on StockFlow to
                                streamline their inventory operations and reduce
                                costs.
                            </p>

                            <div className="space-y-4">
                                {[
                                    {
                                        title: 'Reduce Stock Mistakes',
                                        description:
                                            'Eliminate manual entry errors with real-time tracking',
                                    },
                                    {
                                        title: 'Know Inventory Instantly',
                                        description:
                                            'Get accurate stock levels across all locations in real-time',
                                    },
                                    {
                                        title: 'Track Every Movement',
                                        description:
                                            'Complete audit trail of all inventory transactions',
                                    },
                                    {
                                        title: 'Scale Effortlessly',
                                        description:
                                            'Add warehouses and grow without limitations',
                                    },
                                    {
                                        title: 'Save Employee Time',
                                        description:
                                            'Automate repetitive tasks and focus on growth',
                                    },
                                ].map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex gap-3"
                                    >
                                        <div className="flex-shrink-0">
                                            <Check className="mt-1 h-6 w-6 text-accent" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">
                                                {benefit.title}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {benefit.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-accent/10 to-primary/5 p-8 shadow-2xl">
                                <div className="space-y-6">
                                    {[
                                        {
                                            label: 'Warehouses Connected',
                                            value: '99.9%',
                                        },
                                        {
                                            label: 'Stock Accuracy',
                                            value: '150K+',
                                        },
                                        {
                                            label: 'Daily Transactions',
                                            value: '$2.5M',
                                        },
                                        {
                                            label: 'Inventory Value Tracked',
                                            value: '24/7',
                                        },
                                    ].map((stat, i) => (
                                        <div
                                            key={i}
                                            className="rounded-lg border border-white/20 bg-white/50 p-4 backdrop-blur-sm dark:bg-white/10"
                                        >
                                            <div className="mb-1 text-3xl font-bold text-accent">
                                                {stat.value}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="bg-muted/30 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                            StockFlow vs Others
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            How we compare to traditional methods and basic
                            inventory software
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="px-6 py-4 text-left font-semibold">
                                        Feature
                                    </th>
                                    <th className="px-6 py-4 text-center font-semibold">
                                        Spreadsheets
                                    </th>
                                    <th className="px-6 py-4 text-center font-semibold">
                                        Basic Software
                                    </th>
                                    <th className="px-6 py-4 text-center font-semibold text-accent">
                                        StockFlow
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    'Real-Time Tracking',
                                    'Multi-Warehouse Support',
                                    'Advanced Analytics',
                                    'API Integration',
                                    'Role-Based Access',
                                    '24/7 Support',
                                    'Uptime Guarantee',
                                    'Scalability',
                                ].map((feature, i) => (
                                    <tr
                                        key={i}
                                        className="border-b border-border transition-colors hover:bg-muted/50"
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            {feature}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            -
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Check className="inline h-5 w-5 text-muted" />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Check className="inline h-5 w-5 text-accent" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="relative overflow-hidden py-24">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                value: '99.9%',
                                label: 'Uptime',
                                icon: TrendingUp,
                            },
                            {
                                value: '10x',
                                label: 'Faster Operations',
                                icon: Zap,
                            },
                            {
                                value: '100%',
                                label: 'Real-Time Tracking',
                                icon: BarChart3,
                            },
                            {
                                value: '24/7',
                                label: 'Cloud Access',
                                icon: Globe,
                            },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="rounded-xl border border-border bg-card p-8 text-center transition-all hover:bg-muted/50"
                            >
                                <stat.icon className="mx-auto mb-4 h-8 w-8 text-accent" />
                                <div className="mb-2 text-4xl font-bold">
                                    {stat.value}
                                </div>
                                <div className="text-muted-foreground">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-muted/30 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                            Loved by Our Customers
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            See what business leaders have to say about
                            StockFlow
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            {
                                quote: "StockFlow transformed how we manage inventory across 5 warehouses. We've cut our discrepancies by 95%.",
                                author: 'Sarah Chen',
                                company: 'Retail Dynamics',
                            },
                            {
                                quote: 'The real-time tracking and analytics give us insights we never had before. Absolutely game-changing.',
                                author: 'Mike Rodriguez',
                                company: 'Supply Chain Solutions',
                            },
                            {
                                quote: 'Support team is incredible. Setup was seamless and our team was productive within 24 hours.',
                                author: 'Jennifer Park',
                                company: 'Commerce Hub',
                            },
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="rounded-xl border border-border bg-card p-8 transition-all hover:shadow-lg"
                            >
                                <div className="mb-4 flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-accent">
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <p className="mb-6 text-foreground italic">
                                    "{testimonial.quote}"
                                </p>
                                <div>
                                    <p className="font-semibold">
                                        {testimonial.author}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {testimonial.company}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Choose the perfect plan for your business. All plans
                            include 24/7 support and 99.9% uptime SLA.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {pricingPlans.map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative rounded-xl border p-8 transition-all ${
                                    plan.highlighted
                                        ? 'scale-105 border-accent bg-gradient-to-br from-accent/5 to-primary/5 shadow-xl'
                                        : 'border-border bg-card'
                                }`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-primary-foreground">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="mb-2 text-2xl font-bold">
                                    {plan.name}
                                </h3>
                                <p className="mb-6 text-muted-foreground">
                                    {plan.description}
                                </p>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">
                                        ${plan.price}
                                    </span>
                                    <span className="ml-2 text-muted-foreground">
                                        /month
                                    </span>
                                </div>
                                <button
                                    className={`mb-8 w-full rounded-lg py-3 font-semibold transition-all ${
                                        plan.highlighted
                                            ? 'bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20'
                                            : 'border border-border hover:bg-muted'
                                    }`}
                                >
                                    Get Started
                                </button>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex gap-3">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                                            <span className="text-sm">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-muted/30 py-24">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Have questions? We have answers. Can't find what
                            you're looking for? Contact our support team.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                viewport={{ once: true }}
                                className="overflow-hidden rounded-lg border border-border bg-card transition-colors hover:bg-muted/50"
                            >
                                <button
                                    onClick={() =>
                                        setOpenFaqId(
                                            openFaqId === faq.id
                                                ? null
                                                : faq.id,
                                        )
                                    }
                                    className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-muted/30"
                                >
                                    <span className="text-left font-semibold">
                                        {faq.question}
                                    </span>
                                    <motion.div
                                        animate={{
                                            rotate:
                                                openFaqId === faq.id ? 180 : 0,
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {openFaqId === faq.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{
                                                opacity: 1,
                                                height: 'auto',
                                            }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="border-t border-border bg-muted/20 px-6 py-4 text-muted-foreground"
                                        >
                                            {faq.answer}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="relative overflow-hidden py-24">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />
                    <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
                </div>

                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="mb-6 text-4xl font-bold md:text-5xl">
                            Ready to Transform Your Inventory Management?
                        </h2>
                        <p className="mb-8 text-xl text-muted-foreground">
                            Join thousands of businesses managing inventory
                            smarter with StockFlow. Start your free trial today.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/20"
                            >
                                Start Your Free Trial
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="rounded-lg border border-border px-8 py-4 text-lg font-semibold transition-all hover:bg-muted/50"
                            >
                                Schedule a Demo
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border bg-primary py-12 text-primary-foreground">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 grid gap-8 md:grid-cols-4">
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground text-sm font-bold text-primary">
                                    SF
                                </div>
                                <span className="text-lg font-bold">
                                    StockFlow
                                </span>
                            </div>
                            <p className="text-sm text-primary-foreground/80">
                                Enterprise inventory management for modern
                                businesses.
                            </p>
                        </div>
                        <div>
                            <h4 className="mb-4 font-semibold">Product</h4>
                            <ul className="space-y-2 text-sm text-primary-foreground/80">
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-primary-foreground"
                                    >
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-primary-foreground"
                                    >
                                        Pricing
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-primary-foreground"
                                    >
                                        Documentation
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 font-semibold">Company</h4>
                            <ul className="space-y-2 text-sm text-primary-foreground/80">
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-primary-foreground"
                                    >
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-primary-foreground"
                                    >
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-primary-foreground"
                                    >
                                        Careers
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 font-semibold">Legal</h4>
                            <ul className="space-y-2 text-sm text-primary-foreground/80">
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-primary-foreground"
                                    >
                                        Privacy
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-primary-foreground"
                                    >
                                        Terms
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-primary-foreground"
                                    >
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-between border-t border-primary-foreground/20 pt-8 text-sm text-primary-foreground/80 md:flex-row">
                        <p>
                            &copy; {new Date().getFullYear()} StockFlow. All
                            rights reserved.
                        </p>
                        <div className="mt-4 flex gap-6 md:mt-0">
                            {['Twitter', 'LinkedIn', 'Facebook'].map(
                                (social) => (
                                    <a
                                        key={social}
                                        href="#"
                                        className="transition-colors hover:text-primary-foreground"
                                    >
                                        {social}
                                    </a>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Feature data
const features = [
    {
        icon: Package,
        title: 'Multi-Warehouse Management',
        description:
            'Manage inventory across unlimited warehouse locations from a single dashboard',
    },
    {
        icon: TrendingUp,
        title: 'Real-Time Inventory Tracking',
        description:
            'See stock levels update instantly across all your warehouses and locations',
    },
    {
        icon: BarChart3,
        title: 'Advanced Analytics & Reports',
        description:
            'Get actionable insights with comprehensive reporting and forecasting tools',
    },
    {
        icon: Users,
        title: 'User Roles & Permissions',
        description:
            'Control access with granular role-based permissions for your team members',
    },
    {
        icon: Lock,
        title: 'Enterprise Security',
        description:
            'Bank-level encryption and compliance with industry security standards',
    },
    {
        icon: Globe,
        title: 'Cloud-Based & Scalable',
        description:
            'Grow your business without worrying about infrastructure or capacity limits',
    },
];

// Pricing plans
const pricingPlans = [
    {
        name: 'Starter',
        description: 'Perfect for small businesses',
        price: 99,
        highlighted: false,
        features: [
            'Up to 1 warehouse',
            '10 team members',
            'Basic reporting',
            'Email support',
            '99% uptime SLA',
        ],
    },
    {
        name: 'Professional',
        description: 'Best for growing businesses',
        price: 299,
        highlighted: true,
        features: [
            'Up to 5 warehouses',
            'Unlimited team members',
            'Advanced analytics',
            '24/7 priority support',
            '99.9% uptime SLA',
            'API access',
            'Custom integrations',
        ],
    },
    {
        name: 'Enterprise',
        description: 'For large-scale operations',
        price: 999,
        highlighted: false,
        features: [
            'Unlimited warehouses',
            'Unlimited team members',
            'Custom reporting',
            'Dedicated support',
            '99.99% uptime SLA',
            'Advanced security',
            'Custom development',
        ],
    },
];

// FAQ data
const faqs = [
    {
        id: 'faq-1',
        question: 'How long does it take to set up StockFlow?',
        answer: 'Most businesses are up and running within 24 hours. Our onboarding team guides you through the setup process, and we handle data migration if needed. Average setup time is 2-4 hours of active work.',
    },
    {
        id: 'faq-2',
        question: 'Can I integrate StockFlow with my existing systems?',
        answer: 'Yes! StockFlow integrates with popular e-commerce platforms, accounting software, and logistics providers. We also offer a REST API for custom integrations. Contact our team for a list of supported integrations.',
    },
    {
        id: 'faq-3',
        question: 'What kind of support do you offer?',
        answer: 'All plans include email support. Professional and Enterprise plans include 24/7 priority support via chat and phone. We also provide comprehensive documentation and video tutorials.',
    },
    {
        id: 'faq-4',
        question: 'Is there a free trial available?',
        answer: 'Yes! We offer a 14-day free trial with full access to all features. No credit card required to start. You can also schedule a personalized demo with our team.',
    },
    {
        id: 'faq-5',
        question: 'What about data security and compliance?',
        answer: 'We maintain enterprise-grade security with 256-bit encryption, regular security audits, and compliance with GDPR, SOC 2, and ISO 27001 standards. Your data is backed up automatically and stored in secure, redundant data centers.',
    },
    {
        id: 'faq-6',
        question: 'Can I export my data if I leave?',
        answer: 'Absolutely! You have full access to your data at any time. We support CSV, Excel, and API exports. You can migrate to another system whenever you choose.',
    },
];
