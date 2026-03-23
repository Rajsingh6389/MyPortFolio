import SectionLabel from './SectionLabel';
import { experience } from '../data/portfolioData';
import useReveal from '../hooks/useReveal';
import styles from './Experience.module.css';

function ExpCard({ title, sub, bgLabel, points, delay }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`${styles.card} reveal d${delay}`}>
      <div className={styles.bgLabel}>{bgLabel}</div>
      <div className={styles.title}>{title}</div>
      <div className={styles.sub}>{sub}</div>
      <ul className={styles.points}>
        {points.map((p, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: p.replace('410+', '<strong>410+ LeetCode problems</strong>') }} />
        ))}
      </ul>
    </div>
  );
}

export default function Experience() {
  const ref = useReveal();
  return (
    <section id="experience" className={styles.experience}>
      <div ref={ref} className="reveal">
        <SectionLabel text="Experience" />
        <h2 className={styles.heading}>What I've <em>Done</em></h2>
      </div>
      {experience.map((e, i) => (
        <ExpCard key={i} {...e} delay={i + 1} />
      ))}
    </section>
  );
}
