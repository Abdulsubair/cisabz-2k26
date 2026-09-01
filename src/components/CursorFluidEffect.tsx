import React, { useEffect } from 'react';

interface Particle {
  x: number; y: number;
  size: number; color: string;
  vx: number; vy: number;
  life: number; maxLife: number;
}

export const CursorFluidEffect: React.FC = () => {
  useEffect(() => {
    // Inject canvas directly into body — bypasses any parent overflow/clip
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 99999;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const colors = [
      'rgba(0, 229, 255, 0.5)',
      'rgba(56, 189, 248, 0.4)',
      'rgba(214, 175, 55, 0.4)',
    ];

    // Start off-screen so ring doesn't flash at 0,0
    let mouseX = -300;
    let mouseY = -300;
    let ringX = -300;
    let ringY = -300;
    let lastX = -300;
    let lastY = -300;
    let isVisible = false;

    // Keep canvas pixel dims in sync with viewport
    const syncSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    syncSize();
    window.addEventListener('resize', syncSize);

    const onMouseMove = (e: MouseEvent) => {
      // clientX/clientY are viewport-relative — exactly what fixed canvas needs
      mouseX = e.clientX;
      mouseY = e.clientY;
      isVisible = true;

      const dist = Math.hypot(mouseX - lastX, mouseY - lastY);
      if (dist > 10) {
        particles.push({
          x: mouseX, y: mouseY,
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

    const onMouseLeave = () => { isVisible = false; };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        isVisible = true;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    const render = () => {
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth lerp: ring trails behind the actual cursor
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (isVisible) {
        ctx.save();
        ctx.globalAlpha = 1;

        // Outer glowing ring (lerp trailing effect)
        ctx.beginPath();
        ctx.arc(ringX, ringY, 14, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0, 229, 255, 0.5)';
        ctx.stroke();

        // Inner solid dot (snaps exactly to real cursor)
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 229, 255, 0.75)';
        ctx.fill();

        ctx.restore();
      }

      // Micro dust particle trail
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        const alpha = (1 - p.life / p.maxLife) * 0.45;
        ctx.save();
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0, p.size * (1 - p.life / p.maxLife)), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      particles = particles.filter((p) => p.life < p.maxLife);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', syncSize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchmove', onTouchMove);
      cancelAnimationFrame(animationFrameId);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  // Canvas is injected directly into body, not via React DOM
  return null;
};
