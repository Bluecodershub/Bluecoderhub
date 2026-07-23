import { motion } from 'framer-motion';

// Animated conic-gradient border. Uses a rotating pseudo-layer masked to the
// perimeter of the wrapper. Cheaper than a keyframed background because only
// a single transform property animates.
export default function GradientBorder({
    children,
    className = '',
    radius = 'rounded-2xl',
    from = 'rgba(59,130,246,0.65)',
    via = 'rgba(147,197,253,0.55)',
    to = 'rgba(59,130,246,0.15)',
    thickness = 1,
    duration = 8,
}) {
    return (
        <div className={`relative ${radius} ${className}`}>
            <motion.div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 ${radius} overflow-hidden`}
                animate={{ rotate: 360 }}
                transition={{ duration, ease: 'linear', repeat: Infinity }}
                style={{
                    background: `conic-gradient(from 0deg, ${from}, ${via}, ${to}, ${from})`,
                    filter: 'blur(0.5px)',
                }}
            />
            <div
                className={`relative ${radius}`}
                style={{
                    margin: thickness,
                    background: 'inherit',
                }}
            >
                {children}
            </div>
        </div>
    );
}
