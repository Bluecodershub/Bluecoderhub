import { useEffect, useRef } from 'react';

// Cursor-follow spotlight. Wraps children in a container that tracks pointer
// position via CSS custom properties, so a child can reference them with
// bg-[radial-gradient(circle_at_var(--sx)_var(--sy),_...)] without React
// re-rendering on every mousemove. Cheap: only the container updates.
export default function Spotlight({ children, className = '' }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

        const handleMove = (event) => {
            const rect = el.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            el.style.setProperty('--sx', `${x}%`);
            el.style.setProperty('--sy', `${y}%`);
        };

        el.addEventListener('pointermove', handleMove);
        return () => el.removeEventListener('pointermove', handleMove);
    }, []);

    return (
        <div ref={ref} className={`spotlight-host relative ${className}`} style={{ '--sx': '50%', '--sy': '50%' }}>
            {children}
        </div>
    );
}
