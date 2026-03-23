import { Suspense, lazy, useRef, useEffect, useCallback } from 'react';
import styles from './Hero.module.css';
import { personalInfo } from '../data/portfolioData';

const Spline = lazy(() => import('@splinetool/react-spline'));

const COLLEGE = 'B.Tech @ AKTU · 2023–2027';
const RAJ_LETTERS = ['R', 'A', 'J'];
const SINGH_LETTERS = ['S', 'I', 'N', 'G', 'H'];

const SOCIAL_LINKS = [
  { label: 'GitHub', href: personalInfo.github },
  { label: 'LinkedIn', href: personalInfo.linkedin },
  { label: 'Resume', href: personalInfo.portfolio },
];

export default function Hero() {
  const heroRef = useRef(null);
  const rightRef = useRef(null);
  const statsRef = useRef(null);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ rx: 0, ry: 0, sx: 0, sy: 0 });

  /* ── smooth mouse-tracking parallax ── */
  const handleMouseMove = useCallback((e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseRef.current = {
      x: (e.clientX - cx) / (rect.width / 2),   // -1 → +1
      y: (e.clientY - cy) / (rect.height / 2),
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      const { x, y } = mouseRef.current;
      const cur = currentRef.current;
      const lerp = (a, b) => a + (b - a) * 0.06;

      cur.rx = lerp(cur.rx, y * -12);   // right panel rotateX
      cur.ry = lerp(cur.ry, x * 14);   // right panel rotateY
      cur.sx = lerp(cur.sx, x * 8);   // stats card rotateY
      cur.sy = lerp(cur.sy, y * -6);   // stats card rotateX

      if (rightRef.current) {
        rightRef.current.style.transform =
          `perspective(900px) rotateX(${cur.rx}deg) rotateY(${cur.ry}deg) translateZ(0)`;
      }
      if (statsRef.current) {
        statsRef.current.style.transform =
          `perspective(600px) rotateY(${cur.sx}deg) rotateX(${cur.sy}deg) translateZ(12px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: 0, y: 0 };
  }, []);

  /* ── particles (stable across renders) ── */
  const particles = useRef(
    [...Array(22)].map(() => ({
      px: `${Math.random() * 100}%`,
      py: `${Math.random() * 100}%`,
      pd: `${(Math.random() * 7 + 3).toFixed(1)}s`,
      psize: `${(Math.random() * 3 + 1).toFixed(1)}px`,
      pop: (Math.random() * 0.5 + 0.2).toFixed(2),
      color: Math.random() > 0.5 ? 'var(--accent)' : 'var(--accent2)',
    }))
  ).current;

  return (
    <section
      id="hero"
      className={styles.hero}
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Backgrounds ── */}
      <div className={styles.gridBg} />
      <div className={styles.auroraBg} />
      <div className={styles.noiseBg} />

      {/* ── Floating orbs ── */}
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={`${styles.orb} ${styles.orb3}`} />
      <div className={`${styles.orb} ${styles.orb4}`} />

      {/* ── Expanding rings ── */}
      <div className={styles.ringWrap}>
        <div className={`${styles.ring} ${styles.ring1}`} />
        <div className={`${styles.ring} ${styles.ring2}`} />
        <div className={`${styles.ring} ${styles.ring3}`} />
      </div>

      {/* ── Particles ── */}
      {particles.map((p, i) => (
        <div
          key={i}
          className={styles.particle}
          style={{
            '--px': p.px,
            '--py': p.py,
            '--pd': p.pd,
            '--psize': p.psize,
            '--pop': p.pop,
            '--pc': p.color,
          }}
        />
      ))}

      {/* ── Main grid ── */}
      <div className={styles.container}>

        {/* LEFT */}
        <div className={styles.left}>

          <div className={styles.tagWrapper}>
            <div className={styles.tagDot} />
            <span className={styles.tag}>{COLLEGE}</span>
          </div>

          <h1 className={styles.name}>
            <span className={styles.nameRow}>
              {RAJ_LETTERS.map((l, i) => (
                <span key={i} className={styles.nameLetter} style={{ '--li': i }}>
                  {l}
                </span>
              ))}
            </span>
            <span className={`${styles.nameRow} ${styles.gradRow}`}>
              {SINGH_LETTERS.map((l, i) => (
                <span
                  key={i}
                  className={`${styles.nameLetter} ${styles.gradLetter}`}
                  style={{ '--li': i + 3 }}
                >
                  {l}
                </span>
              ))}
            </span>
          </h1>

          <p className={styles.role}>
            <span className={styles.roleSlash}>&gt;</span>
            <span className={styles.roleTrack}>
              <span className={styles.roleScroll}>
                <span>Full Stack Developer</span>
                <span>ML Engineer</span>
                <span>DSA Expert</span>
                <span>Full Stack Developer</span>
              </span>
            </span>
            <span className={styles.cursor}>_</span>
          </p>

          {/* Stats – 3D tilt controlled by JS */}
          <div className={styles.statsCard} ref={statsRef}>
            <div className={styles.statsShine} />
            {[
              { val: personalInfo.cgpa, lab: 'CGPA' },
              { val: '510+', lab: 'LeetCode' },
              { val: '5+', lab: 'Projects' },
            ].map((s, i) => (
              <>
                {i > 0 && <div key={`d${i}`} className={styles.statDivider} />}
                <div key={s.lab} className={styles.statItem}>
                  <span className={styles.statVal}>{s.val}</span>
                  <span className={styles.statLab}>{s.lab}</span>
                </div>
              </>
            ))}
          </div>

          <p className={styles.desc}>
            Building <span className={styles.bold}>scalable systems</span> with Java &amp; Spring Boot,
            intelligent solutions with Python &amp; ML, deploying to the{' '}
            <span className={styles.bold}>cloud with AWS</span>.
          </p>

          <div className={styles.btns}>
            <a href="#contact" className={styles.btnP}>
              <span className={styles.btnGlow} />
              <span className={styles.btnRipple} />
              Get In Touch
            </a>
            <a href="#projects" className={styles.btnO}>View Projects ↗</a>
          </div>

          <div className={styles.socialStrip}>
            {SOCIAL_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                {label}
              </a>
            ))}
          </div>

        </div>

        {/* RIGHT – 3D panel */}
        <div className={styles.right}>
          <div className={styles.splineWrapper} ref={rightRef}>
            <div className={styles.splineContainer}>
              <div className={styles.splineGlow} />

              <Suspense
                fallback={
                  <div className={styles.loader}>
                    <div className={styles.loaderOrb} />
                    <div className={styles.loaderRing} />
                    <div className={styles.loaderRing2} />
                  </div>
                }
              >
                <Spline
                  scene="https://prod.spline.design/1vkPkVnJuvn-SV2t/scene.splinecode"
                  className={styles.splineCanvas}
                />
              </Suspense>

              {/* Floating badges */}
              <div className={`${styles.badge} ${styles.b1}`}>
                <span className={styles.badgeDot} />Full Stack
              </div>
              <div className={`${styles.badge} ${styles.b2}`}>
                <span className={styles.badgeDot} style={{ background: 'var(--accent2)' }} />ML Engineer
              </div>
              <div className={`${styles.badge} ${styles.b3}`}>
                <span className={styles.badgeDot} style={{ background: '#34d399' }} />AWS Cloud
              </div>

              {/* Tech pills */}
              <div className={styles.techOrbit}>
                {['Java', 'Python', 'React', 'AWS', 'Spring'].map((t, i) => (
                  <div key={t} className={styles.techPill} style={{ '--ti': i }}>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className={styles.scrollIndicator}>
        <div className={styles.mouse}><div className={styles.wheel} /></div>
        <span>Scroll</span>
      </div>
    </section>
  );
}