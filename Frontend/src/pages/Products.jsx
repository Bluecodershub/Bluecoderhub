import { useState } from 'react';
import { motion } from 'framer-motion';
import FadeInSection from '../components/animations/FadeInSection';
import LiquidBlob from '../components/animations/LiquidBlob';
import products from '../data/products.json';
import { MdArchitecture } from 'react-icons/md';
import { FiPenTool, FiBox, FiCrosshair, FiTriangle } from 'react-icons/fi';
import { api } from '../utils/api';

const findProduct = (id) => products.find((product) => product.id === id);

function WaitlistForm({ source, placeholder = 'Enter your email for early access' }) {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const submit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            await api.subscribe(email, source);
            setSuccess(true);
            setEmail('');
        } catch (err) {
            setError(err.message || 'Subscription failed.');
        }
    };

    if (success) {
        return (
            <div className="p-4 bg-white/5 border border-white/20 rounded-xl text-white text-sm">
                ✓ You're on the list! We'll notify you at launch.
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="flex gap-2">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                required
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-white/50"
            />
            <button
                type="submit"
                className="px-5 py-3 rounded-xl text-sm font-bold text-black bg-white hover:bg-gray-100 whitespace-nowrap"
            >
                Notify Me
            </button>
            {error && <p className="text-red-400 text-xs">{error}</p>}
        </form>
    );
}

export default function Products() {
    const cadCopilot = findProduct('cad-copilot');

    return (
        <div className="min-h-screen pt-24 pb-20">
            {/* Hero */}
            <section className="relative py-20 px-4 text-center overflow-hidden">
                <div className="absolute inset-0 bg-hero-gradient" />
                <LiquidBlob color="#ffffff" size={500} className="top-0 left-0 opacity-5" />
                <LiquidBlob color="#ffffff" size={400} delay={3} className="bottom-0 right-0 opacity-5" />
                <div className="relative z-10 max-w-3xl mx-auto">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-white/70 text-sm font-medium mb-6">
                        Our Products
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-display font-bold text-white mb-6">
                        Products That <span className="gradient-text">Transform</span>
                    </h1>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        We build products that solve real problems at scale — starting with an AI copilot
                        for CAD that meets engineers inside the tools they already use.
                    </p>
                </div>
            </section>

            {/* Product Sections */}
            <div className="max-w-7xl mx-auto px-4 py-16">

                {/* AI CAD Copilot */}
                <FadeInSection id="cad-copilot">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-3 mb-6">
                                <div className="text-5xl text-brand-blue"><MdArchitecture /></div>
                                <div>
                                    <div className="inline-block px-3 py-1 rounded-full border border-white/20 text-gray-500 text-xs font-bold mb-1">
                                        COMING SOON
                                    </div>
                                    <h2 className="text-3xl font-display font-bold text-white">{cadCopilot.name}</h2>
                                </div>
                            </div>
                            <p className="text-white opacity-60 font-medium mb-4">{cadCopilot.tagline}</p>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                {cadCopilot.description}
                            </p>

                            {/* Progress */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Development Progress</span>
                                    <span className="text-white font-bold opacity-80">25%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '25%' }}
                                        transition={{ duration: 2, ease: 'easeOut' }}
                                        className="h-full bg-white rounded-full"
                                    />
                                </div>
                            </div>

                            {/* Capability strip */}
                            <div className="grid grid-cols-2 gap-2 mb-8">
                                {[
                                    'Natural-Language Modeling',
                                    'Parametric Suggestions',
                                    'Sketch Auto-Constrain',
                                    'Design-Rule Checks'
                                ].map((feature) => (
                                    <div key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                                        <span className="text-white opacity-50 text-xs">✦</span> {feature}
                                    </div>
                                ))}
                            </div>

                            <WaitlistForm source="cad_copilot_waitlist" placeholder="Email for early access to the CAD Copilot" />
                        </div>

                        <div className="relative">
                            <div className="glassmorphism rounded-3xl border border-white/10 p-8 relative overflow-hidden"
                                style={{ boxShadow: '0 0 60px rgba(255,255,255,0.03)' }}>
                                <div className="absolute top-0 left-0 right-0 h-1 bg-white opacity-20" />
                                <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/60 text-xs font-bold">
                                    COMING SOON
                                </div>
                                <div className="text-center mb-6">
                                    <div className="text-8xl mb-4 flex justify-center text-brand-blue"><MdArchitecture /></div>
                                    <div className="text-2xl font-display font-bold text-white">AI CAD Copilot</div>
                                    <div className="text-white opacity-40 text-sm">Engineer • Sketch • Iterate</div>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Sketch Intent Parser', icon: <FiPenTool /> },
                                        { label: 'Parametric Geometry', icon: <FiBox /> },
                                        { label: 'Constraint Solver', icon: <FiCrosshair /> },
                                        { label: 'Tolerance Inspector', icon: <FiTriangle /> }
                                    ].map(({ label, icon }, i) => (
                                        <motion.div
                                            key={label}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-brand-blue">
                                                {icon}
                                            </div>
                                            <span className="text-sm text-gray-300 italic">{label}</span>
                                            <div className="ml-auto w-2 h-2 rounded-full bg-white opacity-40 animate-pulse" />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeInSection>
            </div>
        </div>
    );
}
