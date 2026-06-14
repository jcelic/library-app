import styles from './ThemeSwitch.module.css';
import { MoonIcon, SunIcon } from '@phosphor-icons/react';

const ThemeSwitch = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      className={styles.switch}
      data-checked={checked}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      aria-label="Toggle dark mode"
    >
      <span className={styles.icon}>
        {checked ? <MoonIcon /> : <SunIcon />}
      </span>
      <span className={styles.thumb} />
    </button>
  );
};

export default ThemeSwitch;
