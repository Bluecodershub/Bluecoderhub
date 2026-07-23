import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sanitizeURL } from '../../security/sanitize';
import { api } from '../../utils/api';

const footerLinks = {
    Company: [
        { label: 'About Us', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Blog', path: '/blog' },
    ],
    Product: [
        { label: 'AI CAD Copilot', path: '/products' },
        { label: 'Contact', path: '/contact' },
    ],
};
import Logo from './Logo';

export default function Footer() {
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSubscribe = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const emailValue = new FormData(form).get('email');
        setStatus({ type: 'loading', message: '' });
        try {
            await api.subscribe(String(emailValue || ''), 'footer');
            form.reset();
            setStatus({ type: 'success', message: 'Subscribed. We\'ll be in touch.' });
        } catch (err) {
            setStatus({ type: 'error', message: err.message || 'Subscription failed.' });
        }
    };

    return (
        <footer className="bg-brand-gray-900 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Top: Logo + Description */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-3 mb-4">
                            <Logo className="w-10 h-10" />
                            <div>
                                <span className="font-display font-bold text-lg text-white">
                                    Blue<span>coderhub</span>
                                </span>
                                <div className="text-xs text-gray-500 font-mono">PVT LTD</div>
                            </div>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            A product studio building AI-native tools for engineers. Our first product is the <Link to="/products" className="text-white hover:underline underline-offset-4 decoration-white/20">AI CAD Copilot</Link>.
                        </p>
                        <div className="flex gap-3">
                            {/* Social links removed */}
                        </div>
                    </div>

                    {/* Nav Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h3 className="text-white font-semibold font-display mb-4 text-sm tracking-wider uppercase">
                                {category}
                            </h3>
                            <ul className="space-y-2">
                                {links.map(link => (
                                    <li key={link.label}>
                                        {link.external && sanitizeURL(link.external) ? (
                                            <a
                                                href={sanitizeURL(link.external)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                                            >
                                                {link.label} ↗
                                            </a>
                                        ) : link.external ? null : (
                                            <Link
                                                to={link.path}
                                                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                                            >
                                                {link.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter */}
                <div className="glassmorphism rounded-2xl p-6 mb-12 border border-white/10 bg-white/5 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="font-display font-semibold text-white mb-1">Stay in the loop</h3>
                            <p className="text-gray-400 text-sm">Occasional research notes and product updates from Bluecoderhub.</p>
                        </div>
                        <form className="flex gap-2 w-full sm:w-auto" onSubmit={handleSubscribe} noValidate>
                            <input
                                name="email"
                                type="email"
                                placeholder="your@email.com"
                                required
                                aria-label="Email address"
                                className="flex-1 sm:w-64 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-white/50 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={status.type === 'loading'}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-black bg-white whitespace-nowrap hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {status.type === 'loading' ? 'Subscribing…' : 'Subscribe'}
                            </button>
                        </form>
                    </div>
                    {status.message && (
                        <p
                            role="status"
                            aria-live="polite"
                            className={`mt-4 text-xs font-medium ${status.type === 'success' ? 'text-blue-300' : 'text-red-300'}`}
                        >
                            {status.message}
                        </p>
                    )}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Bluecoderhub PVT LTD. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link to="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</Link>
                        <Link to="/cookies" className="text-gray-500 hover:text-gray-300 transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
