import SectionLabel from './SectionLabel';
import { personalInfo, education, stats } from '../data/portfolioData';
import useReveal from '../hooks/useReveal';
import styles from './About.module.css';

function EduCard({ inst, degree, period, score }) {
  return (
    <div className={styles.eduCard}>
      <div className={styles.eduInst}>{inst}</div>
      <div className={styles.eduDeg}>{degree}{period ? ` · ${period}` : ''}</div>
      <div className={styles.eduScore}>{score}</div>
    </div>
  );
}

function StatCard({ num, label, delay }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`${styles.stat} reveal d${delay}`}>
      <div className={styles.statNum}>{num}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function About() {
  const leftRef  = useReveal();
  const rightRef = useReveal();

  return (
    <section id="about" className={styles.about}>
      <div ref={leftRef} className={`${styles.left} reveal`}>
        <SectionLabel text="About Me" />
        <h2 className={styles.title}>
          Building the <em>Future,</em><br />Line by Line
        </h2>
        <p className={styles.text}>{personalInfo.summary}</p>
        <p className={styles.text}>{personalInfo.summary2}</p>
        <div className={styles.eduCards}>
          {education.map((e, i) => <EduCard key={i} {...e} />)}
        </div>
      </div>

      <div ref={rightRef} className={`${styles.right} reveal d2`}>
        <SectionLabel text="Stats" />
        <h3 className={styles.subTitle}>By the <em>Numbers</em></h3>
        <div className={styles.stats}>
          {stats.map((s, i) => <StatCard key={i} {...s} delay={i + 1} />)}
        </div>
      </div>
    </section>
  );
}
