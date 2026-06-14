import styles from './NotFound.module.css';
import { HouseIcon, WarningCircleIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const NotFound = () => {
  useDocumentTitle('404');
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <WarningCircleIcon
          size={72}
          weight="duotone"
          className={styles.icon}
          aria-hidden="true"
        />

        <span className={styles.code}>404</span>

        <h1>Page not found</h1>

        <p>
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>

        <button
          type="button"
          className={styles.homeBtn}
          onClick={() => navigate('/')}
        >
          <HouseIcon size={20} />
          Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
