import styles from './ErrorState.module.css';

const ErrorState = ({ title = 'Something went wrong', message, onRetry }) => {
  return (
    <div className={styles.errorState}>
      <h2>{title}</h2>

      {message && <p>{message}</p>}

      {onRetry && (
        <button type="button" className={styles.retryBtn} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
