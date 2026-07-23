import { motion } from 'framer-motion';

export default function AnimatedHeading({ text, className = '', delay = 0, wordDelay = 0.08 }) {
    const words = text.split(' ');
    return (
        <motion.h1
            className={className}
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: { transition: { delayChildren: delay, staggerChildren: wordDelay } },
            }}
        >
            {words.map((word, index) => (
                <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.1em] mr-[0.25em]">
                    <motion.span
                        className="inline-block"
                        variants={{
                            hidden: { y: '110%', opacity: 0 },
                            visible: { y: '0%', opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
                        }}
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </motion.h1>
    );
}
