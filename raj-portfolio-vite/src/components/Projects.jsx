import { useRef, useCallback, useEffect } from 'react';
import SectionLabel from './SectionLabel';
import { projects }  from '../data/portfolioData';
import useReveal     from '../hooks/useReveal';
import styles        from './Projects.module.css';

/* ════════════════════════════════
   FACE RECOGNITION VISUAL
   Animated: scanning face, grid, bounding box
════════════════════════════════ */
function FaceScanner() {
  return (
    <div className={styles.faceScene}>
      {/* background dots grid */}
      <div className={styles.faceGrid} />

      {/* face outline SVG */}
      <svg className={styles.faceSvg} viewBox="0 0 120 140" fill="none">
        {/* head */}
        <ellipse cx="60" cy="68" rx="36" ry="44"
          stroke="rgba(0,212,255,0.5)" strokeWidth="1.5" strokeDasharray="4 3" />
        {/* eyes */}
        <ellipse cx="44" cy="57" rx="6" ry="4"
          stroke="rgba(0,212,255,0.7)" strokeWidth="1.2" />
        <ellipse cx="76" cy="57" rx="6" ry="4"
          stroke="rgba(0,212,255,0.7)" strokeWidth="1.2" />
        {/* pupils */}
        <circle cx="44" cy="57" r="2" fill="rgba(0,212,255,0.9)" />
        <circle cx="76" cy="57" r="2" fill="rgba(0,212,255,0.9)" />
        {/* nose */}
        <path d="M58 63 L55 74 L65 74" stroke="rgba(0,212,255,0.5)" strokeWidth="1" strokeLinejoin="round" />
        {/* mouth */}
        <path d="M48 83 Q60 90 72 83" stroke="rgba(0,212,255,0.7)" strokeWidth="1.2" fill="none" />
        {/* landmark dots */}
        {[[44,57],[76,57],[60,50],[48,83],[72,83],[60,74]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="1.8" fill="rgba(0,212,255,0.6)" />
        ))}
      </svg>

      {/* bounding box corners */}
      <div className={`${styles.corner} ${styles.cTL}`} />
      <div className={`${styles.corner} ${styles.cTR}`} />
      <div className={`${styles.corner} ${styles.cBL}`} />
      <div className={`${styles.corner} ${styles.cBR}`} />

      {/* scan beam */}
      <div className={styles.scanBeam} />

      {/* confidence label */}
      <div className={styles.faceLabel}>
        <span className={styles.faceLabelDot} />
        ID: Raj_Singh · 98.7%
      </div>
    </div>
  );
}

/* ════════════════════════════════
   JOB PORTAL VISUAL
   Animated: REST API calls, auth flow
════════════════════════════════ */
const API_CALLS = [
  { method: 'POST',   path: '/auth/login',     status: '200 OK',      color: '#34d399' },
  { method: 'GET',    path: '/jobs?page=1',     status: '200 OK',      color: '#34d399' },
  { method: 'POST',   path: '/jobs/apply',      status: '201 Created', color: '#7c6dfa' },
  { method: 'GET',    path: '/recruiter/apps',  status: '200 OK',      color: '#34d399' },
  { method: 'DELETE', path: '/jobs/7/close',    status: '204 No Cont', color: '#ff6b6b' },
];

function ApiTerminal() {
  const linesRef = useRef([]);
  useEffect(() => {
    let i = 0;
    const show = () => {
      if (i < linesRef.current.length) {
        if (linesRef.current[i]) linesRef.current[i].style.opacity = '1';
        i++;
        setTimeout(show, 450);
      } else {
        setTimeout(() => {
          linesRef.current.forEach(el => { if (el) el.style.opacity = '0'; });
          i = 0;
          setTimeout(show, 700);
        }, 2200);
      }
    };
    const t = setTimeout(show, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={styles.apiScene}>
      <div className={styles.apiBar}>
        <span className={styles.apiDot} style={{ background: '#ff5f57' }} />
        <span className={styles.apiDot} style={{ background: '#febc2e' }} />
        <span className={styles.apiDot} style={{ background: '#28c840' }} />
        <span className={styles.apiTitle}>Spring Boot · REST API</span>
      </div>
      <div className={styles.apiBody}>
        {API_CALLS.map((c, i) => (
          <div
            key={i}
            ref={el => linesRef.current[i] = el}
            className={styles.apiRow}
            style={{ opacity: 0, transition: 'opacity .22s ease' }}
          >
            <span className={styles.apiMethod} style={{ color: c.color }}>{c.method}</span>
            <span className={styles.apiPath}>{c.path}</span>
            <span className={styles.apiStatus} style={{ color: c.color }}>{c.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════
   THEME CONFIG PER PROJECT
════════════════════════════════ */
const PROJECT_THEMES = {
  '01': {
    accent:  '#7c6dfa',
    glow:    'rgba(124,109,250,0.25)',
    Visual:  ApiTerminal,
    badge:   '🌐 Web App',
  },
  '02': {
    accent:  '#00d4ff',
    glow:    'rgba(0,212,255,0.22)',
    Visual:  FaceScanner,
    badge:   '🤖 CV / ML',
  },
};

/* ════════════════════════════════
   3D TILT PROJECT CARD
════════════════════════════════ */
function ProjectCard({ num, type, title, points, stack, link, index }) {
  const revealRef = useReveal();
  const cardRef   = useRef(null);
  const rafRef    = useRef(null);
  const mouseRef  = useRef({ x: 0, y: 0 });
  const curRef    = useRef({ rx: 0, ry: 0 });
  const theme     = PROJECT_THEMES[num] || PROJECT_THEMES['01'];
  const { Visual } = theme;

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
      c.rx += (y * -10 - c.rx) * 0.09;
      c.ry += (x *  12 - c.ry) * 0.09;
      if (cardRef.current)
        cardRef.current.style.transform =
          `perspective(900px) rotateX(${c.rx}deg) rotateY(${c.ry}deg) translateZ(10px)`;
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
    <div
      ref={revealRef}
      className={`${styles.cardOuter} reveal`}
      style={{ '--idx': index, '--accent': theme.accent, '--glow': theme.glow }}
    >
      <div
        ref={cardRef}
        className={styles.card}
        onMouseMove={onMove}
        onMouseEnter={startTilt}
        onMouseLeave={stopTilt}
      >
        <div className={styles.cardGlow}   />
        <div className={styles.cardShine}  />
        <div className={styles.topBorder}  />

        {/* project number watermark */}
        <div className={styles.bgNum}>{num}</div>

        {/* header row */}
        <div className={styles.cardHeader}>
          <span className={styles.type}>{type}</span>
          <span className={styles.themeBadge}>{theme.badge}</span>
        </div>

        <h3 className={styles.title}>{title}</h3>

        {/* PROJECT-SPECIFIC 3D visual */}
        <Visual />

        {/* bullet points */}
        <ul className={styles.points}>
          {points.map((p, i) => (
            <li key={i}><span className={styles.bullet}>▸</span>{p}</li>
          ))}
        </ul>

        {/* tech stack */}
        <div className={styles.stack}>
          {stack.map(s => (
            <span key={s} className={styles.stackTag}>{s}</span>
          ))}
        </div>

        {/* link */}
        <a href={link} target="_blank" rel="noreferrer" className={styles.link}>
          <span>View on GitHub</span>
          <span className={styles.arrow}>→</span>
        </a>
      </div>
    </div>
  );
}

/* ════════════════════════════════
   MAIN EXPORT
════════════════════════════════ */
export default function Projects() {
  const headRef = useReveal();
  return (
    <section id="projects" className={styles.projects}>
      <div className={styles.gridBg} />
      <div className={styles.orbA}   />
      <div className={styles.orbB}   />

      <div ref={headRef} className={`${styles.header} reveal`}>
        <SectionLabel text="Projects" />
        <h2 className={styles.heading}>Things I've <em>Built</em></h2>
        <p className={styles.subHead}>Real-world systems · production-ready code</p>
      </div>

      <div className={styles.grid}>
        {projects.map((p, i) => (
          <ProjectCard key={p.num} {...p} index={i} />
        ))}
      </div>
    </section>
  );
}
