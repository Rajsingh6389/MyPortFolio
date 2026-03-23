import SectionLabel from './SectionLabel';
import { skills } from '../data/portfolioData';
import useReveal from '../hooks/useReveal';
import styles from './Skills.module.css';

const colorMap = { purple: styles.tagPurple, cyan: styles.tagCyan, red: styles.tagRed, yellow: styles.tagYellow };

function SkillCard({ icon, name, tags, color, delay }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`${styles.card} reveal d${delay}`}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.name}>{name}</div>
      <div className={styles.tags}>
        {tags.map(t => (
          <span key={t} className={`${styles.tag} ${colorMap[color] || ''}`}>{t}</span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const ref = useReveal();
  return (
    <section id="skills" className={styles.skills}>
      <div ref={ref} className="reveal">
        <SectionLabel text="Tech Stack" />
        <h2 className={styles.title}>What I <em>Work With</em></h2>
      </div>
      <div className={styles.grid}>
        {skills.map((s, i) => (
          <SkillCard key={s.name} {...s} delay={(i % 3) + 1} />
        ))}
      </div>
    </section>
  );
}
