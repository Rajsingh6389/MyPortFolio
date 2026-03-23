import { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let W, H, pts = [], raf;
    const mouse = { x: 0, y: 0 };

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      reset() {
        this.x   = Math.random() * W;
        this.y   = Math.random() * H;
        this.vx  = (Math.random() - 0.5) * 0.32;
        this.vy  = (Math.random() - 0.5) * 0.32;
        this.r   = Math.random() * 1.4 + 0.3;
        this.a   = Math.random() * 0.45 + 0.12;
        this.col = Math.random() < 0.5 ? '124,109,250' : '0,212,255';
      }
      constructor() { this.reset(); }
      update() {
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 90) {
          const f = (90 - d) / 90;
          this.vx += f * (dx / d) * 0.4;
          this.vy += f * (dy / d) * 0.4;
          const sp = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          if (sp > 1.8) { this.vx = (this.vx / sp) * 1.8; this.vy = (this.vy / sp) * 1.8; }
        }
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.col},${this.a})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 130; i++) pts.push(new Particle());

    const onMouse = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', onMouse);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => { p.update(); p.draw(); });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(124,109,250,${(1 - d / 110) * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
