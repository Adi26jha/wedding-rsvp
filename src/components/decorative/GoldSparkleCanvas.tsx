"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
}

export const GoldSparkleCanvas: React.FC<{ className?: string }> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    // Mobile check to cap particle count for 60fps performance
    const isMobile = window.innerWidth < 640;
    const maxParticles = isMobile ? 24 : 45;
    const particles: Particle[] = [];

    const createParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedY: -(Math.random() * 0.4 + 0.15), // Gentle upward drift
      speedX: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.7 + 0.2,
      fadeSpeed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
    });

    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += p.fadeSpeed;

        if (p.opacity <= 0.1 || p.opacity >= 0.85) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        // Wrap around borders
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        // Draw soft glowing gold dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(218, 181, 94, ${Math.max(0, p.opacity)})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "#ECC876";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none w-full h-full ${className}`}
    />
  );
};
