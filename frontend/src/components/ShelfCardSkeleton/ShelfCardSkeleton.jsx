import styles from './ShelfCardSkeleton.module.css';

export default function ShelfCardSkeleton() {
  return (
    <div className={styles.shelf}>
      <div className={styles.header}>
        <div className={styles.title} />

        <div className={styles.actions}>
          <div className={styles.actionBtn} />
          <div className={styles.actionBtn} />
        </div>
      </div>

      <div className={styles.books}>
        <div className={styles.book} />
        <div className={styles.book} />
        <div className={styles.book} />
        <div className={styles.addBookBtn} />
      </div>

      <div className={styles.count} />
    </div>
  );
}
