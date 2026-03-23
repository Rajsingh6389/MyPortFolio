import SectionLabel from './SectionLabel';
import { projects } from '../data/portfolioData';
import useReveal from '../hooks/useReveal';
import styles from './Projects.module.css';

function ProjectCard({ num, type, title, points, stack, link, delay }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`${styles.card} proj-card reveal d${delay}`}>
      <div className={styles.bgNum}>{num}</div>
      <div className={styles.type}>{type}</div>
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.points}>
        {points.map((p, i) => <li key={i}>{p}</li>)}
      </ul>
      <div className={styles.stack}>
        {stack.map(s => <span key={s} className={styles.stackTag}>{s}</span>)}
      </div>
      <a href={link} target="_blank" rel="noreferrer" className={styles.link}>
        View on GitHub <span className={styles.arrow}>→</span>
      </a>
    </div>
  );
}

export default function Projects() {
  const ref = useReveal();
  return (
    <section id="projects" className={styles.projects}>
      <div ref={ref} className="reveal">
        <SectionLabel text="Projects" />
        <h2 className={styles.heading}>Things I've <em>Built</em></h2>
      </div>
      <div className={styles.grid}>
        {projects.map((p, i) => (
          <ProjectCard key={p.num} {...p} delay={(i % 3) + 1} />
        ))}
      </div>
    </section>
  );
}
