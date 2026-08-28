import styles from './Hero.module.scss';

function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.appBar}>
        <span className={styles.mark} aria-hidden="true">E</span>
        <span className={styles.productName}>Employee Creator</span>
        <span className={styles.status}>Saved</span>
      </div>
      <div className={styles.titleRow}>
        <div>
          <h1 className={styles.heroTitle}>Employees</h1>
          <p>Manage people and review their employment details.</p>
        </div>
      </div>
    </header>
  );
}

export default Hero;
