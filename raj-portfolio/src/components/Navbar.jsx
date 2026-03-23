import styles from './Navbar.module.css';

const links = ['About', 'Skills', 'Experience', 'Projects', 'Contact'];

export default function Navbar() {
  const scroll = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>RS</div>
      <ul className={styles.links}>
        {links.map(l => (
          <li key={l}>
            <button onClick={() => scroll(l)} className={styles.link}>{l}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
