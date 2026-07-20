import { Link } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
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
} from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Home() {
    const [scrollY, setScrollY] = useState(0)
    const [activeNav, setActiveNav] = useState('home')
    const [openFaqId, setOpenFaqId] = useState<string | null>(null)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="min-h-screen bg-secondary text-foreground">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-sm">
                            SF
                        </div>
                        <span className="font-bold text-lg">StockFlow</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
                        {['Features', 'How It Works', 'Pricing', 'FAQ'].map((item) => (
                            <button
                                key={item}
                                onClick={() => setActiveNav(item)}
                                className={`text-sm transition-colors ${activeNav === item
                                    ? 'text-primary font-semibold'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={'/login'}>
                            <button className="px-4 py-2 cursor-pointer text-sm font-medium transition-colors hover:text-primary">
                                Sign In
                            </button>
                        </Link>
                        <Link href={'/register'}>
                            <button className="px-4 py-2 cursor-pointer bg-primary text-primary-foreground rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary/20">
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-40 right-40 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-40 left-40 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.div
                                className="inline-block mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                            >
                                <div className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium flex items-center gap-2 w-fit">
                                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                                    Trusted by 500+ businesses worldwide
                                </div>
                            </motion.div>

                            <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold mb-6 leading-tight text-balance">
                                Inventory Management That{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/60">
                                    Keeps Your Business Moving
                                </span>
                            </h1>

                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                Real-time inventory tracking across multiple warehouses. Know exactly where your stock is, reduce errors by 99%, and scale your business with confidence.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-primary/20"
                                >
                                    Start Free Trial
                                    <ArrowRight className="inline ml-2 w-4 h-4" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-3 border border-border rounded-lg font-semibold transition-all hover:bg-muted/50"
                                >
                                    Watch Demo
                                </motion.button>
                            </div>

                            <div className="flex flex-wrap gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-accent" />
                                    <span>99.9% Uptime SLA</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-accent" />
                                    <span>24/7 Support</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-accent" />
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
                            <div className="relative rounded-xl overflow-hidden shadow-2xl">
                                <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 aspect-video flex items-center justify-center">
                                    <div className="space-y-3 w-full px-6">
                                        <div className="grid grid-cols-3 gap-3">
                                            {[1, 2, 3].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3 + i * 0.1 }}
                                                    className="h-16 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 flex items-center justify-center"
                                                >
                                                    <Package className="w-6 h-6 text-accent/60" />
                                                </motion.div>
                                            ))}
                                        </div>
                                        <div className="h-20 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="py-16 border-y border-border bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Trusted by Leading Companies
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-center">
                        {['Retail Co', 'Supply Inc', 'Logistics Pro', 'Trade Hub', 'Commerce Plus'].map(
                            (company) => (
                                <motion.div
                                    key={company}
                                    whileHover={{ scale: 1.05 }}
                                    className="flex items-center justify-center p-4 rounded-lg transition-colors hover:bg-muted/50"
                                >
                                    <span className="text-sm font-medium text-muted-foreground">{company}</span>
                                </motion.div>
                            )
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to manage inventory efficiently across your entire operation
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="p-6 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
                        <p className="text-lg text-muted-foreground">
                            Get started in minutes with our intuitive setup process
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { number: '1', title: 'Connect Your Warehouses', description: 'Add all your warehouse locations and inventory sources' },
                            { number: '2', title: 'Import Inventory Data', description: 'Upload existing inventory or start fresh with real-time tracking' },
                            { number: '3', title: 'Set Up Permissions', description: 'Define user roles and access levels for your team' },
                            { number: '4', title: 'Enable Integrations', description: 'Connect to your existing business systems' },
                            { number: '5', title: 'Train Your Team', description: 'Quick onboarding with guided walkthroughs' },
                            { number: '6', title: 'Monitor & Optimize', description: 'Track performance and receive actionable insights' },
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="relative p-6 rounded-xl border border-border bg-card"
                            >
                                <div className="absolute -top-4 -left-4 w-10 h-10 bg-accent text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                                    {step.number}
                                </div>
                                <h3 className="text-lg font-semibold mb-2 mt-4">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Businesses Choose StockFlow</h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                From small retailers to enterprise warehouses, thousands of businesses rely on StockFlow to streamline their inventory operations and reduce costs.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { title: 'Reduce Stock Mistakes', description: 'Eliminate manual entry errors with real-time tracking' },
                                    { title: 'Know Inventory Instantly', description: 'Get accurate stock levels across all locations in real-time' },
                                    { title: 'Track Every Movement', description: 'Complete audit trail of all inventory transactions' },
                                    { title: 'Scale Effortlessly', description: 'Add warehouses and grow without limitations' },
                                    { title: 'Save Employee Time', description: 'Automate repetitive tasks and focus on growth' },
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
                                            <Check className="w-6 h-6 text-accent mt-1" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{benefit.title}</h4>
                                            <p className="text-muted-foreground text-sm">{benefit.description}</p>
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
                            <div className="relative rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-accent/10 to-primary/5 p-8">
                                <div className="space-y-6">
                                    {[
                                        { label: 'Warehouses Connected', value: '99.9%' },
                                        { label: 'Stock Accuracy', value: '150K+' },
                                        { label: 'Daily Transactions', value: '$2.5M' },
                                        { label: 'Inventory Value Tracked', value: '24/7' },
                                    ].map((stat, i) => (
                                        <div key={i} className="p-4 bg-white/50 dark:bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                                            <div className="text-3xl font-bold text-accent mb-1">{stat.value}</div>
                                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="py-24 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">StockFlow vs Others</h2>
                        <p className="text-lg text-muted-foreground">
                            How we compare to traditional methods and basic inventory software
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-4 px-6 font-semibold">Feature</th>
                                    <th className="text-center py-4 px-6 font-semibold">Spreadsheets</th>
                                    <th className="text-center py-4 px-6 font-semibold">Basic Software</th>
                                    <th className="text-center py-4 px-6 font-semibold text-accent">StockFlow</th>
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
                                    <tr key={i} className="border-b border-border hover:bg-muted/50 transition-colors">
                                        <td className="py-4 px-6 font-medium">{feature}</td>
                                        <td className="text-center py-4 px-6">-</td>
                                        <td className="text-center py-4 px-6">
                                            <Check className="w-5 h-5 text-muted inline" />
                                        </td>
                                        <td className="text-center py-4 px-6">
                                            <Check className="w-5 h-5 text-accent inline" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { value: '99.9%', label: 'Uptime', icon: TrendingUp },
                            { value: '10x', label: 'Faster Operations', icon: Zap },
                            { value: '100%', label: 'Real-Time Tracking', icon: BarChart3 },
                            { value: '24/7', label: 'Cloud Access', icon: Globe },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center p-8 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all"
                            >
                                <stat.icon className="w-8 h-8 text-accent mx-auto mb-4" />
                                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                                <div className="text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by Our Customers</h2>
                        <p className="text-lg text-muted-foreground">
                            See what business leaders have to say about StockFlow
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "StockFlow transformed how we manage inventory across 5 warehouses. We've cut our discrepancies by 95%.",
                                author: 'Sarah Chen',
                                company: 'Retail Dynamics',
                            },
                            {
                                quote: "The real-time tracking and analytics give us insights we never had before. Absolutely game-changing.",
                                author: 'Mike Rodriguez',
                                company: 'Supply Chain Solutions',
                            },
                            {
                                quote: "Support team is incredible. Setup was seamless and our team was productive within 24 hours.",
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
                                className="p-8 rounded-xl border border-border bg-card hover:shadow-lg transition-all"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-accent">
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <p className="text-foreground mb-6 italic">"{testimonial.quote}"</p>
                                <div>
                                    <p className="font-semibold">{testimonial.author}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-lg text-muted-foreground">
                            Choose the perfect plan for your business. All plans include 24/7 support and 99.9% uptime SLA.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative p-8 rounded-xl border transition-all ${plan.highlighted
                                    ? 'border-accent bg-gradient-to-br from-accent/5 to-primary/5 scale-105 shadow-xl'
                                    : 'border-border bg-card'
                                    }`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-primary-foreground rounded-full text-xs font-semibold">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-muted-foreground mb-6">{plan.description}</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">${plan.price}</span>
                                    <span className="text-muted-foreground ml-2">/month</span>
                                </div>
                                <button
                                    className={`w-full py-3 rounded-lg font-semibold transition-all mb-8 ${plan.highlighted
                                        ? 'bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20'
                                        : 'border border-border hover:bg-muted'
                                        }`}
                                >
                                    Get Started
                                </button>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex gap-3">
                                            <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-muted/30">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-lg text-muted-foreground">
                            Have questions? We have answers. Can't find what you're looking for? Contact our support team.
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
                                className="border border-border rounded-lg overflow-hidden bg-card hover:bg-muted/50 transition-colors"
                            >
                                <button
                                    onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                                >
                                    <span className="font-semibold text-left">{faq.question}</span>
                                    <motion.div
                                        animate={{ rotate: openFaqId === faq.id ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {openFaqId === faq.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="border-t border-border px-6 py-4 bg-muted/20 text-muted-foreground"
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
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Inventory Management?</h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            Join thousands of businesses managing inventory smarter with StockFlow. Start your free trial today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg transition-all hover:shadow-lg hover:shadow-primary/20"
                            >
                                Start Your Free Trial
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-8 py-4 border border-border rounded-lg font-semibold text-lg transition-all hover:bg-muted/50"
                            >
                                Schedule a Demo
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-primary text-primary-foreground py-12 border-t border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-primary-foreground text-primary rounded-lg flex items-center justify-center font-bold text-sm">
                                    SF
                                </div>
                                <span className="font-bold text-lg">StockFlow</span>
                            </div>
                            <p className="text-primary-foreground/80 text-sm">
                                Enterprise inventory management for modern businesses.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-primary-foreground/80">
                                <li>
                                    <a href="#" className="hover:text-primary-foreground transition-colors">
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary-foreground transition-colors">
                                        Pricing
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary-foreground transition-colors">
                                        Documentation
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-primary-foreground/80">
                                <li>
                                    <a href="#" className="hover:text-primary-foreground transition-colors">
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary-foreground transition-colors">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary-foreground transition-colors">
                                        Careers
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-primary-foreground/80">
                                <li>
                                    <a href="#" className="hover:text-primary-foreground transition-colors">
                                        Privacy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary-foreground transition-colors">
                                        Terms
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary-foreground transition-colors">
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-primary-foreground/80">
                        <p>&copy; {new Date().getFullYear()} StockFlow. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            {['Twitter', 'LinkedIn', 'Facebook'].map((social) => (
                                <a key={social} href="#" className="hover:text-primary-foreground transition-colors">
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

// Feature data
const features = [
    {
        icon: Package,
        title: 'Multi-Warehouse Management',
        description: 'Manage inventory across unlimited warehouse locations from a single dashboard',
    },
    {
        icon: TrendingUp,
        title: 'Real-Time Inventory Tracking',
        description: 'See stock levels update instantly across all your warehouses and locations',
    },
    {
        icon: BarChart3,
        title: 'Advanced Analytics & Reports',
        description: 'Get actionable insights with comprehensive reporting and forecasting tools',
    },
    {
        icon: Users,
        title: 'User Roles & Permissions',
        description: 'Control access with granular role-based permissions for your team members',
    },
    {
        icon: Lock,
        title: 'Enterprise Security',
        description: 'Bank-level encryption and compliance with industry security standards',
    },
    {
        icon: Globe,
        title: 'Cloud-Based & Scalable',
        description: 'Grow your business without worrying about infrastructure or capacity limits',
    },
]

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
]

// FAQ data
const faqs = [
    {
        id: 'faq-1',
        question: 'How long does it take to set up StockFlow?',
        answer:
            'Most businesses are up and running within 24 hours. Our onboarding team guides you through the setup process, and we handle data migration if needed. Average setup time is 2-4 hours of active work.',
    },
    {
        id: 'faq-2',
        question: 'Can I integrate StockFlow with my existing systems?',
        answer:
            'Yes! StockFlow integrates with popular e-commerce platforms, accounting software, and logistics providers. We also offer a REST API for custom integrations. Contact our team for a list of supported integrations.',
    },
    {
        id: 'faq-3',
        question: 'What kind of support do you offer?',
        answer:
            'All plans include email support. Professional and Enterprise plans include 24/7 priority support via chat and phone. We also provide comprehensive documentation and video tutorials.',
    },
    {
        id: 'faq-4',
        question: 'Is there a free trial available?',
        answer:
            'Yes! We offer a 14-day free trial with full access to all features. No credit card required to start. You can also schedule a personalized demo with our team.',
    },
    {
        id: 'faq-5',
        question: 'What about data security and compliance?',
        answer:
            'We maintain enterprise-grade security with 256-bit encryption, regular security audits, and compliance with GDPR, SOC 2, and ISO 27001 standards. Your data is backed up automatically and stored in secure, redundant data centers.',
    },
    {
        id: 'faq-6',
        question: 'Can I export my data if I leave?',
        answer:
            'Absolutely! You have full access to your data at any time. We support CSV, Excel, and API exports. You can migrate to another system whenever you choose.',
    },
]