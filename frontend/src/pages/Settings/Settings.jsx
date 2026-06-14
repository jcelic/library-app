import { useState } from 'react';
import { UserIcon } from '@phosphor-icons/react';

import styles from './Settings.module.css';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import ThemeSwitch from '../../components/ThemeSwitch/ThemeSwitch';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(
    () => (localStorage.getItem('theme') || 'dark') === 'dark',
  );

  const handleThemeChange = (checked) => {
    const theme = checked ? 'dark' : 'light';

    setDarkMode(checked);
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  };

  useDocumentTitle('Settings');

  return (
    <main className={styles.settings}>
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Profile</h2>
            <p>Manage your account information.</p>
          </div>
        </div>

        <div className={styles.profileContent}>
          <div className={styles.avatarBox}>
            <div className={styles.avatar}>
              <UserIcon aria-hidden="true" />
            </div>
          </div>

          <div className={styles.profileFields}>
            <div className={styles.fieldGrid}>
              <label>
                Name
                <input type="text" defaultValue="John Doe" />
              </label>

              <label>
                Email
                <input type="email" defaultValue="john@example.com" />
              </label>
            </div>

            <div className={styles.profileActions}>
              <button className={styles.secondaryBtn} type="button">
                Upload avatar
              </button>

              <button className={styles.primaryBtn} type="button">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Appearance</h2>
            <p>Customize how the app looks.</p>
          </div>
        </div>

        <div className={styles.settingRow}>
          <div>
            <h3>Dark mode</h3>
            <p>Switch between light and dark theme.</p>
          </div>

          <ThemeSwitch checked={darkMode} onChange={handleThemeChange} />
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Data</h2>
            <p>Export your library data for backup or personal use.</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.secondaryBtn} type="button">
            Export JSON
          </button>
          <button className={styles.secondaryBtn} type="button">
            Export CSV
          </button>
          <button className={styles.secondaryBtn} type="button">
            Export Wishlist
          </button>
          <button className={styles.secondaryBtn} type="button">
            Export Favorites
          </button>
        </div>
      </section>

      <section className={`${styles.card} ${styles.dangerCard}`}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Danger Zone</h2>
            <p>Permanent actions for your library and account.</p>
          </div>
        </div>

        <div className={styles.settingRow}>
          <div>
            <h3>Delete account</h3>
            <p>This action cannot be undone.</p>
          </div>

          <button className={styles.dangerBtn} type="button">
            Delete account
          </button>
        </div>
      </section>
    </main>
  );
};

export default Settings;
