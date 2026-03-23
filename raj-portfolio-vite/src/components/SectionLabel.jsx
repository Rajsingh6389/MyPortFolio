import styles from './SectionLabel.module.css';

export default function SectionLabel({ text, center }) {
  return (
    <div className={`${styles.label} ${center ? styles.center : ''}`}>
      {text}
    </div>
  );
}
