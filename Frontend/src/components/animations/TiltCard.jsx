import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function TiltCard({ children, className = '', intensity = 6 }) {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 200, damping: 20, mass: 0.4 });
    const springY = useSpring(y, { stiffness: 200, damping: 20, mass: 0.4 });

    const rotateX = useTransform(springY, [-0.5, 0.5], [`${intensity}deg`, `-${intensity}deg`]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [`-${intensity}deg`, `${intensity}deg`]);

    const handleMouseMove = (event) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((event.clientX - rect.left) / rect.width - 0.5);
        y.set((event.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
