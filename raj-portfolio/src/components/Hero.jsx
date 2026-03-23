import { useState, useRef } from 'react';
import { personalInfo } from '../data/portfolioData';
import styles from './Hero.module.css';

function Cube3D() {
  return (
    <div className={styles.cubeWrap}>
      <div className={styles.cube}>
        {['fr','bk','lt','rt','tp','bt'].map(f => (
          <div key={f} className={`${styles.face} ${styles[f]}`} />
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const [photo, setPhoto] = useState(null);
  const inputRef = useRef(null);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.gridBg} />
      <Cube3D />

      {/* LEFT */}
      <div className={styles.left}>
        <div className={styles.tag}>{personalInfo.college}</div>
        <h1 className={styles.name}>
          RAJ<br /><span className={styles.grad}>SINGH</span>
        </h1>
        <p className={styles.role}>// {personalInfo.role}</p>
        <p className={styles.cgpa}>⭐ CGPA: {personalInfo.cgpa} &nbsp;·&nbsp; {personalInfo.leetcode} LeetCode Problems Solved</p>
        <p className={styles.desc}>
          Building scalable systems with Java &amp; Spring Boot, intelligent solutions with Python &amp; ML,
          and deploying to the cloud with AWS. Always shipping, always learning.
        </p>
        <div className={styles.loc}>
          <span className={styles.pulseDot} />
          {personalInfo.location}
        </div>
        <div className={styles.btns}>
          <a href="#contact" className={styles.btnP} onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Get In Touch
          </a>
          <a href="#projects" className={styles.btnO} onClick={e => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}>
            View Projects
          </a>
        </div>
      </div>

      {/* RIGHT — photo */}
      <div className={styles.right}>
        <div className={styles.photoWrap}>
          <div className={styles.photoGlow} />
          <div className={styles.photoFrame}>
            {photo ? (
              <img src={photo} alt="Raj Singh" className={styles.photoImg} />
            ) : (
              <>
                <svg className={styles.photoIcon} width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#7c6dfa" strokeWidth="1">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                <p className={styles.photoHint}>YOUR PHOTO<br />GOES HERE</p>
                <button className={styles.photoBtn} onClick={() => inputRef.current.click()}>+ Add Photo</button>
                <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
              </>
            )}
          </div>
          <span className={`${styles.badge} ${styles.b1}`}>☕ Java Full Stack</span>
          <span className={`${styles.badge} ${styles.b2}`}>🤖 ML Engineer</span>
          <span className={`${styles.badge} ${styles.b3}`}>☁️ AWS Cloud</span>
        </div>
      </div>

      {/* Scroll hint */}
      <div className={styles.scrollHint}>
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}
