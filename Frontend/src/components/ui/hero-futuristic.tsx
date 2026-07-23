'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import './hero-futuristic.css';

const titleWords = 'Build Your Dreams'.split(' ');

function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    const pointer = { x: -1000, y: -1000 };

    const particles = Array.from({ length: 72 }, (_, index) => ({
      x: 0,
      y: 0,
      radius: 1 + (index % 4) * 0.45,
      speed: 0.15 + (index % 7) * 0.035,
      phase: index * 0.73,
    }));

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      particles.forEach((particle, index) => {
        particle.x = ((index * 97) % Math.max(width, 1));
        particle.y = ((index * 53) % Math.max(height, 1));
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      const glow = context.createRadialGradient(
        width * 0.5,
        height * 0.45,
        0,
        width * 0.5,
        height * 0.45,
        Math.max(width, height) * 0.55
      );
      glow.addColorStop(0, 'rgba(52, 211, 153, 0.16)');
      glow.addColorStop(0.38, 'rgba(59, 130, 246, 0.12)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      context.strokeStyle = 'rgba(255,255,255,0.055)';
      context.lineWidth = 1;
      for (let x = 0; x < width; x += 96) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      for (let y = 0; y < height; y += 96) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      particles.forEach((particle, index) => {
        particle.y += particle.speed;
        particle.x += Math.sin(time * 0.0006 + particle.phase) * 0.18;
        if (particle.y > height + 16) particle.y = -16;

        const distanceX = pointer.x - particle.x;
        const distanceY = pointer.y - particle.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const pull = distance < 170 ? (170 - distance) / 170 : 0;
        const drawX = particle.x - distanceX * pull * 0.08;
        const drawY = particle.y - distanceY * pull * 0.08;

        context.beginPath();
        context.fillStyle = index % 3 === 0 ? 'rgba(52, 211, 153, 0.48)' : 'rgba(255, 255, 255, 0.34)';
        context.arc(drawX, drawY, particle.radius, 0, Math.PI * 2);
        context.fill();
      });

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove);
    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-futuristic__canvas" aria-hidden="true" />;
}

export const Html = () => {
  const [visibleWords, setVisibleWords] = useState(0);
  const delays = useMemo(() => titleWords.map((_, index) => index * 0.12), []);

  useEffect(() => {
    if (visibleWords >= titleWords.length) return;
    const timeout = window.setTimeout(() => setVisibleWords((value) => value + 1), 260);
    return () => window.clearTimeout(timeout);
  }, [visibleWords]);

  return (
    <section className="hero-futuristic">
      <AmbientCanvas />

      <div className="hero-futuristic__media" aria-hidden="true">
        <img src="/images/white_logo.png" alt="" />
      </div>

      <div className="hero-futuristic__content">
        <p className="hero-futuristic__eyebrow">Bluecoderhub Pvt Ltd</p>
        <h1 className="hero-futuristic__title">
          {titleWords.map((word, index) => (
            <span
              key={word}
              className={index < visibleWords ? 'is-visible' : ''}
              style={{ animationDelay: `${delays[index]}s` }}
            >
              {word}
            </span>
          ))}
        </h1>
        <p className="hero-futuristic__subtitle">
          A product studio building the AI CAD Copilot — engineering-native AI for the tools you already model in.
        </p>
        <a className="hero-futuristic__action" href="#next-section">
          Explore
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
};

export default Html;
