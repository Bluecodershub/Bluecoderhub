import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  FiArrowRight,
  FiCheckCircle,
  FiCpu,
  FiCrosshair,
  FiLayers,
  FiShield,
  FiTarget,
  FiZap,
} from 'react-icons/fi';
import { MdArchitecture } from 'react-icons/md';
import FadeInSection from '../components/animations/FadeInSection';
import AnimatedHeading from '../components/animations/AnimatedHeading';
import Magnetic from '../components/animations/Magnetic';
import Marquee from '../components/animations/Marquee';
import TiltCard from '../components/animations/TiltCard';
import Logo from '../components/common/Logo';
import products from '../data/products.json';
import { ROUTES } from '../config/routes';

const metrics = [
  { value: 1, suffix: '', label: 'Flagship product' },
  { value: 4, suffix: '+', label: 'Years engineering depth' },
  { value: 100, suffix: '%', label: 'Founder-owned' },
  { value: 24, suffix: '/7', label: 'Build cadence' },
];

const marqueeTerms = [
  'Parametric geometry',
  'Sketch intent parsing',
  'Constraint solving',
  'Design-rule checks',
  'Tolerance stack review',
  'DFM guidance',
  'Feature-tree reasoning',
  'Engineering-grade AI',
];

const capabilities = [
  {
    icon: <FiCpu />,
    title: 'Engineering-native AI',
    text: 'Copilots that reason about parametric intent, sketch constraints, and manufacturability rules — not generic chat wrapped around a modeler.',
  },
  {
    icon: <FiCrosshair />,
    title: 'Deterministic where it counts',
    text: 'Language models for intent, symbolic solvers for geometry. Engineering output must be exact, not merely plausible.',
  },
  {
    icon: <FiShield />,
    title: 'Production-grade foundations',
    text: 'Authentication, permissions, validation, and auditability are shipped from day one, not retrofitted before launch.',
  },
  {
    icon: <FiLayers />,
    title: 'Focused, studio-shaped delivery',
    text: 'A small, senior team committed to a single product bet. We invest in the surfaces engineers use daily, not a roadmap of demos.',
  },
];

const process = [
  ['01', 'Map the workflow', 'We begin by mapping the engineer’s day — the sketches drawn, the parts redrawn, and where time is lost.'],
  ['02', 'Ship the core loop', 'We prioritize the intent-to-geometry loop, then integrate it with real modelers and design-rule checks.'],
  ['03', 'Harden for production', 'We tighten performance, correctness guarantees, and integration surfaces before opening early access.'],
];

const iconFor = {
  'cad-copilot': <MdArchitecture />,
};

const statusLabel = {
  live: 'Live',
  'coming-soon': 'In development',
};

function ProductCard({ product, index }) {
  const isLive = product.status === 'live';

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      className="group rounded-2xl border border-white/10 bg-white/[0.045] p-5 sm:p-6 hover:border-emerald-300/40 hover:bg-white/[0.07] transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(255,255,255,0.16)]">
          {iconFor[product.id]}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${isLive ? 'bg-emerald-300 text-black' : 'bg-white/10 text-gray-300 border border-white/10'}`}>
          {statusLabel[product.status]}
        </span>
      </div>
      <p className="text-xs font-mono uppercase text-emerald-200/70 mb-2">{product.category}</p>
      <h3 className="text-xl font-display font-bold text-white mb-3">{product.name}</h3>
      <p className="text-sm text-gray-400 leading-relaxed min-h-[5.25rem]">{product.description}</p>
      <div className="mt-6">
        {isLive ? (
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:text-emerald-200 transition-colors"
          >
            Visit product <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </a>
        ) : (
          <Link
            to={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:text-emerald-200 transition-colors"
          >
            View roadmap <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </motion.article>
  );
}

function ProductConsole() {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#060807]/90 p-4 sm:p-5 shadow-[0_30px_100px_rgba(0,0,0,0.55)] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent" />
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
        </div>
        <span className="text-xs font-mono text-gray-500">product-ops/live</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_0.9fr] gap-4">
        <div className="rounded-xl bg-white/[0.055] border border-white/10 p-4">
          <div className="flex items-center gap-3 mb-4">
            <Logo className="w-10 h-10" animated={false} />
            <div>
              <p className="text-white font-bold leading-none">AI CAD Copilot</p>
              <p className="text-xs text-gray-500 mt-1">Build progress</p>
            </div>
          </div>
          <div className="space-y-3">
            {['Sketch parser', 'Constraint solver', 'Rule checker'].map((item, index) => (
              <div key={item} className="flex items-center gap-3">
                <div className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${[65, 42, 28][index]}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: index * 0.15 }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-blue-300"
                  />
                </div>
                <span className="w-28 text-xs text-gray-400">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Intent', 'parsed'],
            ['Geometry', 'parametric'],
            ['Solver', 'symbolic'],
            ['Delivery', 'private beta'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-white/[0.045] border border-white/10 p-4">
              <p className="text-xs text-gray-500 mb-2">{label}</p>
              <p className="text-sm font-bold text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-emerald-300 text-black p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold">Next release lane</p>
          <p className="text-xs text-black/65">Ship the sketch-to-parametric loop end to end.</p>
        </div>
        <FiZap className="text-2xl shrink-0" />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#020403] text-white overflow-hidden">
      <section className="relative min-h-screen flex items-center pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(16,185,129,0.22),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(59,130,246,0.18),transparent_32%),linear-gradient(180deg,rgba(2,4,3,0.15),#020403_88%)]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.9)_1px,transparent_1px)] bg-[size:96px_96px]" />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-300/25 bg-emerald-300/10 text-emerald-100 text-sm font-semibold mb-5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              A product studio building AI-native tools for engineers
            </motion.div>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { delayChildren: 0.3, staggerChildren: 0.12 } } }}
              aria-label="sketch. solve. ship."
              className="mb-7 flex items-center gap-3 font-mono text-xs sm:text-sm uppercase tracking-[0.35em] text-emerald-200/80"
            >
              {['sketch.', 'solve.', 'ship.'].map((word) => (
                <motion.span
                  key={word}
                  variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
              <motion.span
                variants={{ hidden: { opacity: 0, scaleX: 0 }, visible: { opacity: 1, scaleX: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
                className="hidden sm:block h-px w-16 bg-gradient-to-r from-emerald-300/60 to-transparent origin-left"
                aria-hidden="true"
              />
            </motion.p>
            <AnimatedHeading
              text="Engineering-grade AI, embedded in the tools you already build with."
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold leading-[0.95] tracking-normal text-white max-w-4xl"
              delay={0.75}
              wordDelay={0.06}
            />
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 max-w-2xl text-lg sm:text-xl text-gray-300 leading-relaxed"
            >
              Bluecoderhub is a product studio headquartered in Chennai. Our flagship product, the AI CAD Copilot, translates natural-language intent into parametric geometry, sketch suggestions, and design-rule checks — engineered to sit alongside the modelers your team already uses.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 flex flex-col sm:flex-row gap-3"
            >
              <Magnetic strength={0.25}>
                <Link
                  to={ROUTES.PRODUCTS}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-extrabold text-black hover:bg-emerald-100 transition-colors shadow-[0_10px_30px_-10px_rgba(255,255,255,0.35)]"
                >
                  Explore the CAD Copilot <FiArrowRight />
                </Link>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Link
                  to={ROUTES.CONTACT}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/15 px-6 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                >
                  Request early access
                </Link>
              </Magnetic>
            </motion.div>
          </div>

          <FadeInSection delay={0.4} direction="left">
            <ProductConsole />
          </FadeInSection>
        </div>
      </section>

      <Marquee items={marqueeTerms} speed={45} />

      <section className="border-b border-white/10 bg-white/[0.035]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <FadeInSection key={metric.label} delay={index * 0.08}>
              <div className="py-8 sm:py-10 border-white/10 even:border-l lg:border-l first:border-l-0 text-center">
                <p className="text-4xl sm:text-5xl font-display font-extrabold text-white tabular-nums">
                  <CountUp end={metric.value} duration={2.2} enableScrollSpy scrollSpyOnce />{metric.suffix}
                </p>
                <p className="mt-2 text-xs sm:text-sm uppercase font-mono tracking-wider text-gray-500">{metric.label}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      <section id="next-section" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="max-w-3xl mb-12">
              <p className="text-sm font-bold uppercase text-emerald-200/80 mb-3">Current focus</p>
              <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-normal">
                A focused roadmap. A single product commitment.
              </h2>
              <p className="mt-5 text-gray-400 leading-relaxed">
                Bluecoderhub is deliberately small, with a deliberately short roadmap. Our team is committed to the AI CAD Copilot until it delivers measurable value inside real engineering workflows.
              </p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/[0.025] border-y border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12">
          <FadeInSection direction="right">
            <p className="text-sm font-bold uppercase text-emerald-200/80 mb-3">How we build</p>
            <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-normal">
              Engineering-first. Deterministic where it counts.
            </h2>
            <p className="mt-5 text-gray-400 leading-relaxed">
              Generative models are excellent at interpreting intent. They are not the right tool for confirming that a wall thickness meets specification. We separate the two, so the copilot can converse naturally while producing output an engineer can actually ship.
            </p>
          </FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" style={{ perspective: '1200px' }}>
            {capabilities.map((capability, index) => (
              <FadeInSection key={capability.title} delay={index * 0.08}>
                <TiltCard intensity={5} className="h-full">
                  <div className="relative h-full rounded-2xl border border-white/10 bg-[#070a09] p-6 overflow-hidden group">
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,50%),rgba(16,185,129,0.15),transparent_60%)]" />
                    <div className="relative">
                      <div className="w-11 h-11 rounded-xl bg-emerald-300/12 text-emerald-200 border border-emerald-300/20 flex items-center justify-center text-xl mb-5">
                        {capability.icon}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3">{capability.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{capability.text}</p>
                    </div>
                  </div>
                </TiltCard>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase text-emerald-200/80 mb-3">Operating model</p>
                <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-normal">
                  From engineer workflows to production surfaces — without losing the thread.
                </h2>
              </div>
              <Link to={ROUTES.ABOUT} className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-emerald-200">
                Learn about us <FiArrowRight />
              </Link>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {process.map(([step, title, text], index) => (
              <FadeInSection key={step} delay={index * 0.06}>
                <div className="relative h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 overflow-hidden">
                  <span className="text-6xl font-display font-black text-white/[0.055] absolute top-4 right-5">{step}</span>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center font-extrabold mb-8">
                      {step}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{text}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#eafdf5] text-[#07110d]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 items-center">
          <FadeInSection direction="right">
            <p className="text-sm font-extrabold uppercase text-emerald-700 mb-3">Why the CAD Copilot</p>
            <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-normal">
              An AI copilot that respects the engineer’s workflow.
            </h2>
            <p className="mt-5 text-slate-700 leading-relaxed">
              CAD is a workflow, not a chat window. The copilot lives inside the modeler, understands the sketch, and returns geometry an engineer can constrain, tolerance, and manufacture with confidence.
            </p>
          </FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Natural-language sketch and feature intent',
              'Parametric geometry the modeler can edit',
              'Auto-constrain and design-rule verification',
              'Native integration with your CAD environment',
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-3 rounded-xl bg-white/70 border border-emerald-900/10 p-4 hover:bg-white hover:border-emerald-700/30 hover:-translate-y-0.5 transition-all"
              >
                <FiCheckCircle className="text-emerald-700 text-xl shrink-0 mt-0.5" />
                <p className="text-sm font-semibold leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center rounded-3xl border border-white/10 bg-white/[0.045] p-8 sm:p-12">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-6">
            <FiTarget className="text-black text-3xl" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-normal">
            Request early access to the AI CAD Copilot.
          </h2>
          <p className="mt-5 text-gray-400 max-w-2xl mx-auto">
            We are shipping the sketch-to-parametric loop first. Reach out to join the initial access cohort or to discuss partnership opportunities.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Magnetic strength={0.2}>
              <Link to={ROUTES.CONTACT} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-extrabold text-black hover:bg-emerald-100 transition-colors shadow-[0_10px_30px_-10px_rgba(255,255,255,0.35)]">
                Contact Bluecoderhub <FiArrowRight />
              </Link>
            </Magnetic>
            <Magnetic strength={0.18}>
              <Link to={ROUTES.CAREERS} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/15 px-6 text-sm font-bold text-white hover:bg-white/10 transition-colors">
                View Careers
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>
    </main>
  );
}
