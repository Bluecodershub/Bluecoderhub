import { motion } from 'framer-motion';

export default function Marquee({ items, speed = 40 }) {
    const doubled = [...items, ...items];
    return (
        <div className="overflow-hidden py-4 border-y border-white/5 bg-white/[0.02]" aria-hidden="true">
            <motion.div
                className="flex gap-12 whitespace-nowrap"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
            >
                {doubled.map((item, index) => (
                    <span
                        key={`${item}-${index}`}
                        className="text-xs font-mono uppercase tracking-[0.2em] text-gray-500 flex items-center gap-3"
                    >
                        <span className="text-emerald-300/60">◇</span>
                        {item}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
