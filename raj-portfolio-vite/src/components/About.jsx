import { useEffect, useRef, useState, useCallback } from 'react';
import SectionLabel from './SectionLabel';
import { personalInfo } from '../data/portfolioData';
import useReveal from '../hooks/useReveal';
import styles from './About.module.css';

/* ════════════════════════════════
   ANIMATED COUNTER
════════════════════════════════ */
function Counter({ target }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const num = parseFloat(target);
    const isFloat = target.includes('.');
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const steps = 60;
      const inc = num / steps;
      const tick = () => {
        start += inc;
        if (start >= num) { setVal(num); return; }
        setVal(isFloat ? parseFloat(start.toFixed(1)) : Math.floor(start));
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}</span>;
}

/* ════════════════════════════════
   ANIMATED CODE WINDOW
════════════════════════════════ */
const CODE_LINES = [
  { txt: 'class RajSingh {',                   type: 'keyword'  },
  { txt: '  private String role =',             type: 'normal'   },
  { txt: '    "Full Stack Developer";',         type: 'string'   },
  { txt: '',                                    type: 'blank'    },
  { txt: '  @Skills(["Java","React","AWS"])',   type: 'annotation'},
  { txt: '  public void buildSolution() {',     type: 'keyword'  },
  { txt: '    solve(LeetCode.problems(510));',  type: 'fn'       },
  { txt: '    deploy(AWS.ec2().scale());',      type: 'fn'       },
  { txt: '    train(ML.model(accuracy=98));',   type: 'fn'       },
  { txt: '  }',                                 type: 'keyword'  },
  { txt: '',                                    type: 'blank'    },
  { txt: '  CGPA cgpa = new CGPA(8.0);',       type: 'normal'   },
  { txt: '  String email =',                    type: 'normal'   },
  { txt: '    "rm2739159@gmail.com";',          type: 'string'   },
  { txt: '}',                                   type: 'keyword'  },
];

function CodeWindow() {
  const [lineIdx,  setLineIdx]  = useState(0);
  const [charIdx,  setCharIdx]  = useState(0);
  const [displayed, setDisplayed] = useState([]);
  const [cursor,   setCursor]   = useState(true);
  const [done,     setDone]     = useState(false);
  const wrapRef = useRef(null);

  /* cursor blink */
  useEffect(() => {
    const id = setInterval(() => setCursor(c => !c), 530);
    return () => clearInterval(id);
  }, []);

  /* typing logic */
  useEffect(() => {
    if (done) return;
    if (lineIdx >= CODE_LINES.length) { setDone(true); return; }

    const line = CODE_LINES[lineIdx];

    if (line.type === 'blank') {
      const id = setTimeout(() => {
        setDisplayed(d => [...d, { txt: '', type: 'blank' }]);
        setLineIdx(n => n + 1);
        setCharIdx(0);
      }, 160);
      return () => clearTimeout(id);
    }

    if (charIdx < line.txt.length) {
      const id = setTimeout(() => {
        setCharIdx(n => n + 1);
      }, 28 + Math.random() * 22);
      return () => clearTimeout(id);
    }

    /* line complete */
    const id = setTimeout(() => {
      setDisplayed(d => [...d, { txt: line.txt, type: line.type }]);
      setLineIdx(n => n + 1);
      setCharIdx(0);
    }, 120);
    return () => clearTimeout(id);
  }, [lineIdx, charIdx, done]);

  /* restart after pause */
  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => {
      setDisplayed([]);
      setLineIdx(0);
      setCharIdx(0);
      setDone(false);
    }, 3200);
    return () => clearTimeout(id);
  }, [done]);

  /* auto-scroll */
  useEffect(() => {
    if (wrapRef.current) {
      wrapRef.current.scrollTop = wrapRef.current.scrollHeight;
    }
  }, [displayed, charIdx]);

  const currentLine = !done && lineIdx < CODE_LINES.length
    ? CODE_LINES[lineIdx].txt.slice(0, charIdx)
    : null;

  return (
    <div className={styles.codeWindow}>
      {/* title bar */}
      <div className={styles.codeBar}>
        <span className={styles.dot} style={{ background: '#ff5f57' }} />
        <span className={styles.dot} style={{ background: '#febc2e' }} />
        <span className={styles.dot} style={{ background: '#28c840' }} />
        <span className={styles.codeTitle}>RajSingh.java</span>
        <span className={styles.codeLang}>Java</span>
      </div>

      {/* code lines */}
      <div className={styles.codeBody} ref={wrapRef}>
        {displayed.map((ln, i) => (
          <div key={i} className={`${styles.codeLine} ${styles[`ct_${ln.type}`]}`}>
            <span className={styles.lineNo}>{i + 1}</span>
            <span className={styles.lineText}>{ln.txt}</span>
          </div>
        ))}

        {/* current typing line */}
        {currentLine !== null && (
          <div className={`${styles.codeLine} ${styles[`ct_${CODE_LINES[lineIdx].type}`]}`}>
            <span className={styles.lineNo}>{displayed.length + 1}</span>
            <span className={styles.lineText}>
              {currentLine}
              <span className={`${styles.typeCursor} ${cursor ? styles.cursorOn : ''}`}>|</span>
            </span>
          </div>
        )}
      </div>

      {/* bottom status bar */}
      <div className={styles.codeStatus}>
        <span className={styles.statusDot} />
        <span>Ln {displayed.length + 1} · Java · UTF-8</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════
   3D TILT STAT CARD
════════════════════════════════ */
function StatCard({ num, label, icon, color, delay }) {
  const cardRef  = useRef(null);
  const rafRef   = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const curRef   = useRef({ rx: 0, ry: 0 });

  const handleMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    mouseRef.current = {
      x: (e.clientX - cx) / (rect.width  / 2),
      y: (e.clientY - cy) / (rect.height / 2),
    };
  }, []);

  const startTilt = useCallback(() => {
    const tick = () => {
      const { x, y } = mouseRef.current;
      const cur  = curRef.current;
      const lerp = (a, b) => a + (b - a) * 0.1;
      cur.rx = lerp(cur.rx, y * -14);
      cur.ry = lerp(cur.ry, x *  16);
      if (cardRef.current) {
        cardRef.current.style.transform =
          `perspective(600px) rotateX(${cur.rx}deg) rotateY(${cur.ry}deg) translateZ(14px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopTilt = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    mouseRef.current = { x: 0, y: 0 };
    const reset = () => {
      const cur  = curRef.current;
      const lerp = (a, b) => a + (b - a) * 0.08;
      cur.rx = lerp(cur.rx, 0);
      cur.ry = lerp(cur.ry, 0);
      if (cardRef.current) {
        cardRef.current.style.transform =
          `perspective(600px) rotateX(${cur.rx}deg) rotateY(${cur.ry}deg) translateZ(0)`;
      }
      if (Math.abs(cur.rx) > 0.05 || Math.abs(cur.ry) > 0.05) {
        rafRef.current = requestAnimationFrame(reset);
      } else {
        if (cardRef.current) cardRef.current.style.transform = '';
      }
    };
    rafRef.current = requestAnimationFrame(reset);
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const rawNum = num.replace('+', '');
  const suffix = num.includes('+') ? '+' : '';

  return (
    <div
      ref={cardRef}
      className={styles.stat}
      style={{ '--delay': delay, '--col': color }}
      onMouseMove={handleMove}
      onMouseEnter={startTilt}
      onMouseLeave={stopTilt}
    >
      <div className={styles.statGlow} />
      <div className={styles.statCorner} />
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statNum}>
        <Counter target={rawNum} />{suffix}
      </div>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statBar} />
    </div>
  );
}

/* ════════════════════════════════
   TIMELINE EDU CARD
════════════════════════════════ */
function EduCard({ inst, degree, period, score, icon, index }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`${styles.eduCard} reveal`} style={{ '--idx': index }}>
      <div className={styles.eduTimeline}>
        <div className={styles.eduDot} />
        {index < 2 && <div className={styles.eduLine} />}
      </div>
      <div className={styles.eduBody}>
        <div className={styles.eduCardGlow} />
        <div className={styles.eduCardShine} />
        <div className={styles.eduTop}>
          <span className={styles.eduIcon}>{icon}</span>
          <div>
            <div className={styles.eduInst}>{inst}</div>
            <div className={styles.eduDeg}>
              {degree}{period ? ` · ${period}` : ''}
            </div>
          </div>
        </div>
        <div className={styles.eduScore}>{score}</div>
      </div>
    </div>
  );
}

/* ════════════════════════════════
   DATA
════════════════════════════════ */
const eduData = [
  { inst: 'ABES Engineering College',       degree: 'B.Tech — Information Technology', period: 'Oct 2023 – Jul 2027', score: 'CGPA: 8.0', icon: '🎓' },
  { inst: 'Shri S. S. Singh Inter College', degree: 'Class XII',                        period: '',                    score: '90.40%',    icon: '📘' },
  { inst: 'Shri S. S. Singh Inter College', degree: 'Class X',                          period: '2021',                score: '90.33%',    icon: '📗' },
];
const statsData = [
  { num: '510+', label: 'LeetCode Solved',  icon: '⚡', color: '#7c6dfa' },
  { num: '8.0',  label: 'CGPA Score',       icon: '🎯', color: '#00d4ff' },
  { num: '5+',   label: 'Projects Shipped', icon: '🚀', color: '#ff6b6b' },
  { num: '5+',   label: 'Tech Stacks',      icon: '🛠️', color: '#34d399' },
];
const TAGS = ['Full Stack Dev', 'ML Engineer', 'DSA Expert', 'AWS Cloud', 'Open Source'];

/* ════════════════════════════════
   MAIN EXPORT
════════════════════════════════ */
export default function About() {
  const sectionRef = useRef(null);
  const leftRef    = useReveal();
  const rightRef   = useReveal();
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const fn = (e) => {
      if (!sectionRef.current) return;
      const r = sectionRef.current.getBoundingClientRect();
      setMouse({
        x: ((e.clientX - r.left) / r.width)  * 100,
        y: ((e.clientY - r.top)  / r.height) * 100,
      });
    };
    window.addEventListener('mousemove', fn, { passive: true });
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  return (
    <section id="about" className={styles.about} ref={sectionRef}>

      <div className={styles.bgBeam} style={{ '--mx': `${mouse.x}%`, '--my': `${mouse.y}%` }} />
      <div className={styles.gridBg} />
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      {/* ── LEFT ── */}
      <div ref={leftRef} className={`${styles.left} reveal`}>
        <SectionLabel text="About Me" />

        <h2 className={styles.title}>
          Building the{' '}
          <span className={styles.titleGrad}>Future,</span>
          <br />Line by Line
        </h2>

        <p className={styles.text}>{personalInfo.summary}</p>
        <p className={styles.text}>{personalInfo.summary2}</p>

        <div className={styles.tags}>
          {TAGS.map((t, i) => (
            <span key={t} className={styles.tag} style={{ '--ti': i }}>{t}</span>
          ))}
        </div>

        <div className={styles.eduLabel}>
          <span className={styles.eduLabelDot} />
          <span>Education</span>
          <span className={styles.eduLabelLine} />
        </div>

        <div className={styles.eduList}>
          {eduData.map((e, i) => <EduCard key={i} {...e} index={i} />)}
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div ref={rightRef} className={`${styles.right} reveal`}>
        <SectionLabel text="Stats" />
        <h3 className={styles.subTitle}>By the <em>Numbers</em></h3>

        <div className={styles.statsGrid}>
          {statsData.map((s, i) => (
            <StatCard key={i} {...s} delay={`${i * 0.1}s`} />
          ))}
        </div>

        {/* ── Animated Code Window ── */}
        <CodeWindow />

        {/* ── Profile card ── */}
        <div className={styles.profileCard}>
          <div className={styles.profileCardBorder} />
          <div className={styles.profileGlowOrb} />

          <div className={styles.profileTop}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatarRing} />
              <div className={styles.avatarRing2} />
              <div className={styles.avatar}>RS</div>
            </div>
            <div className={styles.profileInfo}>
              <div className={styles.profileName}>Raj Singh</div>
              <div className={styles.profileRole}>Pre-Final Year · IT</div>
              <div className={styles.profileBadges}>
                <span className={styles.badgePurple}>He / Him</span>
                <span className={styles.badgeCyan}>Available</span>
                <span className={styles.badgeGreen}>Open to work</span>
              </div>
            </div>
          </div>

          <div className={styles.profileDivider} />

          <div className={styles.profileBottom}>
            {[
              { lab: 'CGPA',     val: '8.0'  },
              { lab: 'Batch',    val: '2027'  },
              { lab: 'Problems', val: '510+'  },
            ].map(({ lab, val }, i) => (
              <>
                {i > 0 && <div key={`d${i}`} className={styles.profileVDiv} />}
                <div key={lab} className={styles.pStat}>
                  <span>{lab}</span>
                  <strong>{val}</strong>
                </div>
              </>
            ))}
          </div>

          <div className={styles.locationStrip}>
            <span className={styles.locationDot} />
            <span className={styles.locationText}>{personalInfo.location}</span>
          </div>
        </div>
      </div>
    </section>
  );
}