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

    // Start off-screen so ring doesn't flash at 0,0
    let mouseX = -200;
    let mouseY = -200;
    let ringX = -200;
    let ringY = -200;
    let lastX = -200;
    let lastY = -200;
    let isVisible = false;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      // Use clientX/clientY — these are always relative to the viewport,
      // which is what fixed-position canvas needs (no scroll offset needed)
      mouseX = e.clientX;
      mouseY = e.clientY;
      isVisible = true;

      const dist = Math.hypot(mouseX - lastX, mouseY - lastY);
      if (dist > 12) {
        particles.push({
          x: mouseX,
          y: mouseY,
          size: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2 - 0.5,
          life: 0,
          maxLife: Math.random() * 20 + 15,
        });
        lastX = mouseX;
        lastY = mouseY;
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        isVisible = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const render = () => {
      // Always reset globalAlpha before clearing
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth lerp for ring follower
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      // Draw glowing follower ring only when cursor is on screen
      if (isVisible && ringX > -100 && ringY > -100) {
        ctx.save();
        ctx.globalAlpha = 1;

        // Outer glowing ring
        ctx.beginPath();
        ctx.arc(ringX, ringY, 14, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0, 229, 255, 0.5)';
        ctx.stroke();

        // Inner solid dot — snaps exactly to mouse position
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 229, 255, 0.7)';
        ctx.fill();

        ctx.restore();
      }

      // Draw particle trail
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const alpha = (1 - p.life / p.maxLife) * 0.45;
        ctx.save();
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - p.life / p.maxLife), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Remove dead particles
      particles = particles.filter((p) => p.life < p.maxLife);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}
    />
  );
};
