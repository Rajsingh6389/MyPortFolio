import { useRef, useCallback, useEffect } from 'react';
import SectionLabel from './SectionLabel';
import { experience } from '../data/portfolioData';
import useReveal from '../hooks/useReveal';
import styles from './Experience.module.css';

/* ── animated code terminal (CP flavour) ── */
const CP_LINES = [
  { t: 'fn',  s: 'solve(problems: 510+)' },
  { t: 'kw',  s: '// Arrays · Trees · Graphs' },
  { t: 'fn',  s: 'optimize(complexity: O(nlogn))' },
  { t: 'str', s: '"DSA mastery achieved ✓"' },
  { t: 'fn',  s: 'design(scalable_system())' },
  { t: 'kw',  s: '// Consistency · Speed · Logic' },
];

function MiniTerminal() {
  const lineRefs = useRef([]);
  useEffect(() => {
    let i = 0;
    const show = () => {
      if (i < lineRefs.current.length) {
        if (lineRefs.current[i]) lineRefs.current[i].style.opacity = '1';
        i++;
        setTimeout(show, 380);
      } else {
        setTimeout(() => {
          lineRefs.current.forEach(el => { if (el) el.style.opacity = '0'; });
          i = 0;
          setTimeout(show, 600);
        }, 2400);
      }
    };
    const id = setTimeout(show, 400);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className={styles.terminal}>
      <div className={styles.termBar}>
        <span className={styles.tDot} style={{ background: '#ff5f57' }} />
        <span className={styles.tDot} style={{ background: '#febc2e' }} />
        <span className={styles.tDot} style={{ background: '#28c840' }} />
        <span className={styles.termTitle}>competitive_programming.cpp</span>
      </div>
      <div className={styles.termBody}>
        {CP_LINES.map((ln, i) => (
          <div
            key={i}
            ref={el => lineRefs.current[i] = el}
            className={`${styles.termLine} ${styles[`tt_${ln.t}`]}`}
            style={{ opacity: 0, transition: 'opacity .25s ease' }}
          >
            <span className={styles.termLno}>{i + 1}</span>
            <span>{ln.s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── single 3D experience card ── */
function ExpCard({ title, sub, bgLabel, points, index }) {
  const revealRef = useReveal();
  const cardRef   = useRef(null);
  const rafRef    = useRef(null);
  const mouseRef  = useRef({ x: 0, y: 0 });
  const curRef    = useRef({ rx: 0, ry: 0 });

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
      c.rx += (y * -8 - c.rx)  * 0.1;
      c.ry += (x *  10 - c.ry) * 0.1;
      if (cardRef.current)
        cardRef.current.style.transform =
          `perspective(900px) rotateX(${c.rx}deg) rotateY(${c.ry}deg) translateZ(8px)`;
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
          `perspective(900px) rotateX(${c.rx}deg) rotateY(${c.ry}deg) translateZ(0)`;
      if (Math.abs(c.rx) > 0.04 || Math.abs(c.ry) > 0.04)
        rafRef.current = requestAnimationFrame(reset);
      else if (cardRef.current) cardRef.current.style.transform = '';
    };
    rafRef.current = requestAnimationFrame(reset);
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div ref={revealRef} className={`${styles.cardWrap} reveal`} style={{ '--idx': index }}>
      <div
        ref={cardRef}
        className={styles.card}
        onMouseMove={onMove}
        onMouseEnter={startTilt}
        onMouseLeave={stopTilt}
      >
        <div className={styles.cardGlow}  />
        <div className={styles.cardShine} />
        <div className={styles.topLine}   />
        <div className={styles.bgLabel}>{bgLabel}</div>

        <div className={styles.cardHead}>
          <div>
            <div className={styles.title}>{title}</div>
            <div className={styles.sub}>{sub}</div>
          </div>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot} />Ongoing
          </div>
        </div>

        <ul className={styles.points}>
          {points.map((p, i) => (
            <li key={i}>
              <span className={styles.bullet}>▸</span>
              <span dangerouslySetInnerHTML={{
                __html: p.replace('510+', '<strong>510+ problems</strong>')
                         .replace('410+', '<strong>410+ problems</strong>')
              }} />
            </li>
          ))}
        </ul>

        {/* shows animated terminal for the CP card */}
        <MiniTerminal />
      </div>
    </div>
  );
}

export default function Experience() {
  const headRef = useReveal();
  return (
    <section id="experience" className={styles.experience}>
      <div className={styles.gridBg} />
      <div className={styles.orbA}   />

      <div ref={headRef} className={`${styles.header} reveal`}>
        <SectionLabel text="Experience" />
        <h2 className={styles.heading}>What I've <em>Done</em></h2>
        <p className={styles.sub}>Self-driven growth through competitive programming &amp; project engineering</p>
      </div>

      <div className={styles.cards}>
        {experience.map((e, i) => (
          <ExpCard key={i} {...e} index={i} />
        ))}
      </div>
    </section>
  );
}
