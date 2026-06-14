import { useEffect, useState } from 'react';
import { CaretUpIcon } from '@phosphor-icons/react';

import styles from './ScrollToTopBtn.module.css';

const ScrollToTopBtn = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      className={styles.scrollBtn}
      onClick={handleScrollToTop}
      aria-label="Scroll to top"
    >
      <CaretUpIcon size={22} weight="bold" />
    </button>
  );
};

export default ScrollToTopBtn;
