import { useRef, useState, useEffect } from 'react';
import SectionLabel from './SectionLabel';
import { personalInfo } from '../data/portfolioData';
import useReveal from '../hooks/useReveal';
import styles from './Contact.module.css';
import emailjs from "@emailjs/browser";

/* ── Icons ── */
const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);
const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);
const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.12 4.18 2 2 0 015.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const PinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const socialLinks = [
  { icon: <LinkedInIcon />, label: 'LinkedIn',  url: personalInfo.linkedin,                    color: '#0077b5' },
  { icon: <GithubIcon  />, label: 'GitHub',     url: personalInfo.github,                      color: '#7c6dfa' },
  { icon: <GlobeIcon   />, label: 'LeetCode',   url: 'https://leetcode.com/u/rajsingh63/',      color: '#ffa116' },
  { icon: <MailIcon    />, label: 'Mail',        url: `mailto:${personalInfo.email}`,            color: '#00d4ff' },
];

/* ── 3D Social Card ── */
function SocialCard({ item, index }) {
  const ref     = useReveal();
  const cardRef = useRef(null);

  const handleMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2);
    const y = (e.clientY - rect.top   - rect.height / 2) / (rect.height / 2);
    cardRef.current.style.transform =
      `perspective(800px) rotateX(${y * -12}deg) rotateY(${x * 12}deg) translateZ(10px)`;
  };

  const handleLeave = () => {
    if (cardRef.current)
      cardRef.current.style.transform =
        'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
  };

  return (
    <a
      ref={ref}
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className={`${styles.card3D} reveal`}
      style={{ '--i': index, '--accent': item.color }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div ref={cardRef} className={styles.cardInner}>
        <div className={styles.cardGlow} />
        <div className={styles.cardIcon}>{item.icon}</div>
        <div className={styles.cardLabel}>{item.label}</div>
        <div className={styles.cardArrow}>↗</div>
      </div>
    </a>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function Contact() {
  const headRef1 = useReveal();
  const headRef2 = useReveal();
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const fn = (e) =>
      setMouse({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  const [formState,    setFormState]    = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted,    setSubmitted]    = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await emailjs.send(
        "service_tdg9tlk",
        "template_8nr3fv8",
        {
          user_name:  formState.name,
          user_email: formState.email,
          subject:    formState.subject,
          message:    formState.message,
        },
        "WUODLl-ICoMtJ11Du"
      );
      setSubmitted(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      alert('Failed to send message ❌');
      console.error(err);
    }
    setIsSubmitting(false);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className={styles.contact}>

      {/* ── BG ── */}
      <div className={styles.bgScene}>
        <div className={styles.grid3d} />
        <div className={styles.glowOrb} style={{ top: `${mouse.y}%`, left: `${mouse.x}%` }} />
      </div>

      {/* ── HEADER ── */}
      <div ref={headRef1} className="reveal">
        <SectionLabel text="Contact" center />

        <div className={styles.mainTitleWrap}>
          <h2 className={styles.title}>Get In <em>Touch</em></h2>
          <div className={styles.statusBubble}>
            <span className={styles.statusDot} />
            Available for new projects
          </div>
        </div>

        <p className={styles.subText}>
          Have a question or want to work together? Leave a message below and
          I'll get back to you as soon as possible.
        </p>

        {/* ── MAIN GRID ── */}
        <div className={styles.container}>

          {/* Form */}
          <div className={styles.formWrapper}>
            <form onSubmit={handleSubmit} className={styles.form}>

              <div className={styles.inputGroup}>
                <div className={styles.inputField}>
                  <input type="text" name="name" placeholder="Your Name"
                    value={formState.name} onChange={handleInputChange} required />
                  <div className={styles.inputLine} />
                </div>
                <div className={styles.inputField}>
                  <input type="email" name="email" placeholder="Your Email"
                    value={formState.email} onChange={handleInputChange} required />
                  <div className={styles.inputLine} />
                </div>
              </div>

              <div className={styles.inputField}>
                <input type="text" name="subject" placeholder="Subject"
                  value={formState.subject} onChange={handleInputChange} required />
                <div className={styles.inputLine} />
              </div>

              <div className={styles.inputField}>
                <textarea name="message" placeholder="Your Message..." rows="5"
                  value={formState.message} onChange={handleInputChange} required />
                <div className={styles.inputLine} />
              </div>

              <button
                type="submit"
                className={`${styles.submitBtn} ${isSubmitting ? styles.loading : ''}`}
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                <ArrowIcon />
                <div className={styles.btnGlow} />
              </button>

              {submitted && (
                <div className={styles.successMessage}>
                  ✓ Thanks! Your message has been sent successfully.
                </div>
              )}
            </form>
          </div>

          {/* Detail cards */}
          <div className={styles.contactDetails}>
            <div className={styles.detailCard}>
              <div className={styles.iconCircle}><MailIcon /></div>
              <div className={styles.detailText}>
                <label>Email</label>
                <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
              </div>
            </div>
            <div className={styles.detailCard}>
              <div className={styles.iconCircle}><PhoneIcon /></div>
              <div className={styles.detailText}>
                <label>Phone</label>
                <a href={`tel:${personalInfo.phone}`}>{personalInfo.phone}</a>
              </div>
            </div>
            <div className={styles.detailCard}>
              <div className={styles.iconCircle}><PinIcon /></div>
              <div className={styles.detailText}>
                <label>Location</label>
                <span>Crossing Republic, Ghaziabad, UP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SOCIAL ── */}
      <div ref={headRef2} className={`${styles.socialGrid} reveal`}>
        {socialLinks.map((item, i) => (
          <SocialCard key={i} item={item} index={i} />
        ))}
      </div>

      <p className={styles.footerNote}>
        Designed &amp; Built by <strong>Raj Singh</strong> · {new Date().getFullYear()}
      </p>
    </section>
  );
}