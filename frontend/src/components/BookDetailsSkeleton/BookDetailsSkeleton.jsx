import styles from './BookDetailsSkeleton.module.css';

export default function BookDetailsSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.skeletonWrapper}>
          <div className={styles.skeletonImage} />

          <div className={styles.skeletonContent}>
            <div className={styles.skeletonTitle} />

            <div className={styles.skeletonText} />
            <div className={styles.skeletonTextSmall} />

            <div className={styles.skeletonPills}>
              <div className={styles.skeletonPill} />
              <div className={styles.skeletonPill} />
            </div>

            <div className={styles.skeletonButtons}>
              <div className={styles.skeletonButton} />
              <div className={styles.skeletonButton} />
              <div className={styles.skeletonButton} />
              <div className={styles.skeletonButton} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
