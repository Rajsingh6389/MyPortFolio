import { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';

const links = ['About', 'Skills', 'Experience', 'Projects', 'Contact'];

export default function Navbar() {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [active,   setActive]       = useState('');
  const [hidden,   setHidden]       = useState(false);
  const [pillStyle, setPillStyle]   = useState({ left: 0, width: 0, opacity: 0 });
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [cursorPos, setCursorPos]   = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  const linksRef = useRef([]);
  const lastY    = useRef(0);
  const navRef   = useRef(null);

  useEffect(() => {
    const fn = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      setHidden(y > 140 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-38% 0px -55% 0px' }
    );
    links.forEach(l => { const el = document.getElementById(l.toLowerCase()); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (!navRef.current) return;
      const r = navRef.current.getBoundingClientRect();
      setCursorPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    };
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  const movePill = (i) => {
    const el = linksRef.current[i];
    if (!el) return;
    const rect    = el.getBoundingClientRect();
    const navRect = el.closest('ul').getBoundingClientRect();
    setPillStyle({ left: rect.left - navRect.left, width: rect.width, opacity: 1 });
  };
  const hidePill = () => {
    const idx = links.findIndex(l => l.toLowerCase() === active);
    if (idx >= 0) movePill(idx); else setPillStyle(p => ({ ...p, opacity: 0 }));
    setHoveredIdx(null);
  };
  useEffect(() => {
    const idx = links.findIndex(l => l.toLowerCase() === active);
    if (idx >= 0) movePill(idx); else setPillStyle(p => ({ ...p, opacity: 0 }));
  }, [active]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      {/* ── NAV BAR ── */}
      <nav
        ref={navRef}
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${hidden ? styles.hidden : ''}`}
        onMouseEnter={() => setShowCursor(true)}
        onMouseLeave={() => { setShowCursor(false); hidePill(); }}
      >
        <div className={styles.navSpotlight} style={{ left: cursorPos.x, top: cursorPos.y, opacity: showCursor ? 1 : 0 }} />
        <div className={styles.navBorder} />

        <div className={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className={styles.logoBracket}>&lt;</span>
          <span className={styles.logoR}>R</span>
          <span className={styles.logoS}>S</span>
          <span className={styles.logoBracket}>/&gt;</span>
          <div className={styles.logoUnderline} />
        </div>

        <div className={styles.linksWrap}>
          <ul className={styles.links} onMouseLeave={hidePill}>
            <div className={styles.pill} style={{ left: pillStyle.left, width: pillStyle.width, opacity: pillStyle.opacity }} />
            {links.map((l, i) => (
              <li key={l} style={{ '--i': i }}>
                <button
                  ref={el => linksRef.current[i] = el}
                  onClick={() => scrollTo(l)}
                  onMouseEnter={() => { movePill(i); setHoveredIdx(i); }}
                  className={`${styles.link} ${active === l.toLowerCase() ? styles.activeLink : ''} ${hoveredIdx === i ? styles.hoveredLink : ''}`}
                >
                  <span className={styles.linkLabel}>{l}</span>
                  <span className={styles.linkHover} aria-hidden>
                    {l.split('').map((c, j) => <span key={j} style={{ '--j': j }}>{c}</span>)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.actions}>
          <div className={styles.status}>
            <span className={styles.statusRing} />
            <span className={styles.statusDot} />
            <span className={styles.statusText}>Open to Work</span>
          </div>
          <a href="mailto:rm2739159@gmail.com" className={styles.cta}>
            <span>Hire Me</span>
            <span className={styles.ctaArrow}>↗</span>
            <div className={styles.ctaFill} />
          </a>
          <button
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <span className={styles.bLine} />
            <span className={styles.bLine} />
            <span className={styles.bLine} />
          </button>
        </div>
      </nav>

      {/* ── MOBILE FULL-SCREEN MENU ── */}
      {/* Backdrop: separate from panels so it always covers everything */}
      <div
        className={`${styles.menuBackdrop} ${menuOpen ? styles.menuBackdropOpen : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Menu panel */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.noise} />
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />

        {/* Header row */}
        <div className={styles.menuHeader}>
          <div className={styles.menuTag}>
            <span className={styles.menuTagDot} />
            Navigation
          </div>
          <button className={styles.closeBtn} onClick={() => setMenuOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <line x1="1" y1="1" x2="17" y2="17" stroke="#7c6dfa" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="17" y1="1" x2="1"  y2="17" stroke="#7c6dfa" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Big nav links */}
        <nav className={styles.mobileLinks}>
          {links.map((l, i) => (
            <button
              key={l}
              className={`${styles.mobileLink} ${active === l.toLowerCase() ? styles.mobileLinkActive : ''}`}
              style={{ '--i': i }}
              onClick={() => scrollTo(l)}
            >
              <div className={styles.mobileLinkInner}>
                <span className={styles.mobileLinkText}>{l}</span>
                <span className={styles.mobileLinkArrow}>↗</span>
              </div>
              <div className={styles.mobileLinkLine} />
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className={styles.mobileFooter}>
          <div className={styles.mobileFooterLeft}>
            <span className={styles.mobileFooterLabel}>Say hello —</span>
            <a href="mailto:rm2739159@gmail.com" className={styles.mobileFooterEmail}>
              rm2739159@gmail.com
            </a>
          </div>
          <div className={styles.mobileFooterLinks}>
            <a href="https://linkedin.com/in/raj-singh-8b7457333" target="_blank" rel="noreferrer">LI</a>
            <a href="https://github.com/rajsingh" target="_blank" rel="noreferrer">GH</a>
            <a href="https://rajs1nghportfolio.netlify.app" target="_blank" rel="noreferrer">WEB</a>
          </div>
        </div>

        <div className={styles.watermark}>RAJ</div>
      </div>
    </>
  );
}