import { useEffect, useRef, useState } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#01';

// Text-scramble effect. On mount (or when `text` changes) each character
// briefly cycles through random glyphs before resolving to the target.
// Cheap — updates state ~24 times per resolve, cancels on unmount.
export default function TextScramble({ text, className = '', duration = 900, delay = 0 }) {
    const [display, setDisplay] = useState(text);
    const rafRef = useRef();

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setDisplay(text);
            return undefined;
        }
        let frame = 0;
        const totalFrames = Math.round(duration / 40);
        let start = null;
        const timeoutId = window.setTimeout(() => {
            const step = (now) => {
                if (start === null) start = now;
                const progress = Math.min(1, (now - start) / duration);
                const resolved = Math.floor(progress * text.length);
                let next = '';
                for (let i = 0; i < text.length; i += 1) {
                    if (i < resolved) {
                        next += text[i];
                    } else if (text[i] === ' ') {
                        next += ' ';
                    } else {
                        next += CHARS[Math.floor(Math.random() * CHARS.length)];
                    }
                }
                setDisplay(next);
                frame += 1;
                if (frame < totalFrames && progress < 1) {
                    rafRef.current = window.requestAnimationFrame(step);
                } else {
                    setDisplay(text);
                }
            };
            rafRef.current = window.requestAnimationFrame(step);
        }, delay);

        return () => {
            window.clearTimeout(timeoutId);
            if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
        };
    }, [text, duration, delay]);

    return <span className={className}>{display}</span>;
}
