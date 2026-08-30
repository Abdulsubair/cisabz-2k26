import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export const CursorFluidEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const colors = ['rgba(0, 229, 255, 0.5)', 'rgba(56, 189, 248, 0.4)', 'rgba(214, 175, 55, 0.4)'];

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let lastX = -100;
    let lastY = -100;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const dist = Math.hypot(mouseX - lastX, mouseY - lastY);
      if (dist > 12) {
        particles.push({
          x: mouseX,
          y: mouseY,
          size: Math.random() * 2 + 1, // Tiny, subtle size (1-3px)
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2 - 0.5,
          life: 0,
          maxLife: Math.random() * 20 + 15, // Short lifespan
        });
        lastX = mouseX;
        lastY = mouseY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gentle smooth lerp for ring follower
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      // Draw subtle glowing follower ring
      if (ringX > 0 && ringY > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(ringX, ringY, 14, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0, 229, 255, 0.5)';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 229, 255, 0.7)';
        ctx.fill();
        ctx.restore();
      }

      // Draw subtle micro dust sparkles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const alpha = (1 - p.life / p.maxLife) * 0.45; // Soft opacity
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, alpha);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - p.life / p.maxLife), 0, Math.PI * 2);
        ctx.fill();
      }

      particles = particles.filter((p) => p.life < p.maxLife);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
    />
  );
};
