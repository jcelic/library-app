import styles from './ConfirmDelete.module.css';

const ConfirmDelete = ({
  title = 'Delete book?',
  message,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      <p>{message}</p>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className={styles.cancel}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={styles.delete}
        >
          {loading ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  );
};
export default ConfirmDelete;
