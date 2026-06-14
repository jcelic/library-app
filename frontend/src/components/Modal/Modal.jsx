import { useEffect } from 'react';
import styles from './Modal.module.css';
import { createPortal } from 'react-dom';

const Modal = ({ children, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={styles.modalOverlay} onClick={handleOutsideClick}>
      <div className={styles.modalContainer} role="dialog" aria-modal="true">
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
