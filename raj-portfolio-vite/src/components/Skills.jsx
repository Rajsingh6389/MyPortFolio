import { useRef, useCallback, useEffect } from 'react';
import SectionLabel from './SectionLabel';
import { skills }   from '../data/portfolioData';
import useReveal     from '../hooks/useReveal';
import styles        from './Skills.module.css';

/* colour config per category */
const PALETTE = {
  purple: { accent: '#7c6dfa', glow: 'rgba(124,109,250,0.25)', bar: 'linear-gradient(90deg,#7c6dfa,#a78bfa)' },
  cyan:   { accent: '#00d4ff', glow: 'rgba(0,212,255,0.22)',   bar: 'linear-gradient(90deg,#00d4ff,#38bdf8)' },
  red:    { accent: '#ff6b6b', glow: 'rgba(255,107,107,0.22)', bar: 'linear-gradient(90deg,#ff6b6b,#fb923c)' },
  yellow: { accent: '#fbbf24', glow: 'rgba(251,191,36,0.22)',  bar: 'linear-gradient(90deg,#fbbf24,#f59e0b)' },
};

/* ════════════════════════════════
   3D TILT SKILL CARD
════════════════════════════════ */
function SkillCard({ icon, name, tags, color, index }) {
  const revealRef = useReveal();
  const cardRef   = useRef(null);
  const rafRef    = useRef(null);
  const mouseRef  = useRef({ x: 0, y: 0 });
  const curRef    = useRef({ rx: 0, ry: 0 });
  const pal       = PALETTE[color] || PALETTE.purple;

  const onMove = useCallback((e) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseRef.current = {
      x: (e.clientX - r.left  - r.width  / 2) / (r.width  / 2),
      y: (e.clientY - r.top   - r.height / 2) / (r.height / 2),
    };
  }, []);

  const startTilt = useCallback(() => {
    const tick = () => {
      const { x, y } = mouseRef.current;
      const c = curRef.current;
      c.rx += (y * -12 - c.rx) * 0.1;
      c.ry += (x *  14 - c.ry) * 0.1;
      if (cardRef.current)
        cardRef.current.style.transform =
          `perspective(700px) rotateX(${c.rx}deg) rotateY(${c.ry}deg) translateZ(12px)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopTilt = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    mouseRef.current = { x: 0, y: 0 };
    const reset = () => {
      const c = curRef.current;
      c.rx += (0 - c.rx) * 0.08;
      c.ry += (0 - c.ry) * 0.08;
      if (cardRef.current)
        cardRef.current.style.transform =
          `perspective(700px) rotateX(${c.rx}deg) rotateY(${c.ry}deg) translateZ(0)`;
      if (Math.abs(c.rx) > 0.04 || Math.abs(c.ry) > 0.04)
        rafRef.current = requestAnimationFrame(reset);
      else if (cardRef.current)
        cardRef.current.style.transform = '';
    };
    rafRef.current = requestAnimationFrame(reset);
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div
      ref={revealRef}
      className={`${styles.cardOuter} reveal`}
      style={{ '--idx': index, '--accent': pal.accent, '--glow': pal.glow, '--bar': pal.bar }}
    >
      <div
        ref={cardRef}
        className={styles.card}
        onMouseMove={onMove}
        onMouseEnter={startTilt}
        onMouseLeave={stopTilt}
      >
        {/* decorative elements */}
        <div className={styles.cardGlow}   />
        <div className={styles.cardShine}  />
        <div className={styles.cardCorner} />
        <div className={styles.topBorder}  />

        {/* icon hex */}
        <div className={styles.iconWrap}>
          <div className={styles.iconHex} />
          <span className={styles.icon}>{icon}</span>
        </div>

        <div className={styles.name}>{name}</div>

        {/* tags with hover glow */}
        <div className={styles.tags}>
          {tags.map((t) => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>

        {/* animated progress bar */}
        <div className={styles.barTrack}>
          <div className={styles.barFill} />
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════
   FLOATING TECH MARQUEE
════════════════════════════════ */
const ALL_TECH = [
  'Java','Spring Boot','React','Python','AWS EC2','MySQL','OpenCV','JWT','Hibernate',
  'Git','Maven','Tkinter','NumPy','Pandas','REST API','Docker','VS Code','IntelliJ',
];

function TechMarquee() {
  const doubled = [...ALL_TECH, ...ALL_TECH];
  return (
    <div className={styles.marqueeWrap}>
      <div className={styles.marqueeTrack}>
        {doubled.map((t, i) => (
          <span key={i} className={styles.marqueeItem}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════
   MAIN EXPORT
════════════════════════════════ */
export default function Skills() {
  const headRef = useReveal();

  return (
    <section id="skills" className={styles.skills}>
      {/* backgrounds */}
      <div className={styles.gridBg}  />
      <div className={styles.orbA}    />
      <div className={styles.orbB}    />

      {/* header */}
      <div ref={headRef} className={`${styles.header} reveal`}>
        <SectionLabel text="Tech Stack" />
        <h2 className={styles.title}>
          What I <em>Work With</em>
        </h2>
        <p className={styles.sub}>
          Six domains · 30+ technologies · production-ready experience
        </p>
      </div>

      {/* cards grid */}
      <div className={styles.grid}>
        {skills.map((s, i) => (
          <SkillCard key={s.name} {...s} index={i} />
        ))}
      </div>

      {/* scrolling tech marquee */}
      <TechMarquee />
    </section>
  );
}
