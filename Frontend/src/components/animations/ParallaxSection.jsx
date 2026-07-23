import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Scroll-linked parallax wrapper. The child element translates on the Y axis
// as the wrapper enters and leaves the viewport, with a spring smoothing pass
// so scroll feels weighty instead of jittery.
export default function ParallaxSection({ children, className = '', offset = 60 }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });
    const raw = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
    const y = useSpring(raw, { stiffness: 60, damping: 20, mass: 0.6 });

    return (
        <div ref={ref} className={className}>
            <motion.div style={{ y }}>{children}</motion.div>
        </div>
    );
}
