import styles from './BookCardSkeleton.module.css';

export default function BookCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.img} />

      <div className={styles.info}>
        <div className={styles.title} />
        <div className={styles.author} />
      </div>

      <div className={styles.options}>
        <div className={styles.icon} />
        <div className={styles.icon} />
        <div className={styles.icon} />
      </div>
    </div>
  );
}
