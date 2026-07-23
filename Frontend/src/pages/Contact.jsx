import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiSend, FiUsers } from 'react-icons/fi';
import FadeInSection from '../components/animations/FadeInSection';
import Magnetic from '../components/animations/Magnetic';
import { COMPANY_EMAIL } from '../config/constants';
import { api } from '../utils/api';

export default function Contact() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      await api.subscribe(email, 'contact_page');
      setEmail('');
      setStatus({ type: 'success', message: 'Thanks. We added you to the Bluecoderhub update list.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Something went wrong. Please try again.' });
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <FadeInSection>
          <div className="max-w-3xl mb-12">
            <p className="text-sm font-bold uppercase text-blue-200/80 mb-3">Contact</p>
            <h1 className="text-5xl sm:text-6xl font-display font-extrabold text-white tracking-normal">
              Let’s discuss what you want to build.
            </h1>
            <p className="mt-6 text-lg text-gray-400 leading-relaxed">
              Contact Bluecoderhub for product inquiries, partnership discussions, hiring conversations, and early access to the AI CAD Copilot.
            </p>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-6">
          <div className="space-y-4">
            {[
              [<FiMail />, 'Email', COMPANY_EMAIL],
              [<FiUsers />, 'Partnerships', 'Product design, engineering-native AI, and integrations'],
              [<FiMapPin />, 'Headquarters', 'Chennai, India — building for a global audience'],
            ].map(([icon, label, value], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, borderColor: 'rgba(147,197,253,0.4)' }}
                className="rounded-2xl border border-white/10 bg-white/[0.045] p-5"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-300/12 text-blue-200 border border-blue-300/20 flex items-center justify-center text-xl mb-4">
                  {icon}
                </div>
                <h2 className="text-lg font-bold text-white">{label}</h2>
                <p className="mt-1 text-sm text-gray-400">{value}</p>
              </motion.div>
            ))}
          </div>

          <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-[#070a09] p-5 sm:p-7">
            <label className="block text-sm font-bold text-white mb-2" htmlFor="contact-email">
              Email address
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="you@example.com"
                className="min-h-12 flex-1 rounded-lg border border-white/10 bg-white/[0.055] px-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-300/60"
              />
              <Magnetic strength={0.22}>
                <button type="submit" className="min-h-12 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-extrabold text-black hover:bg-blue-100 transition-colors shadow-[0_10px_30px_-10px_rgba(255,255,255,0.35)]">
                  Send <FiSend />
                </button>
              </Magnetic>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              We will use this address only to respond to your inquiry or share Bluecoderhub product updates you have requested.
            </p>
            {status.message && (
              <div className={`mt-5 rounded-xl border p-4 text-sm ${status.type === 'success' ? 'border-blue-300/30 bg-blue-300/10 text-blue-100' : 'border-red-300/30 bg-red-300/10 text-red-100'}`}>
                {status.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
