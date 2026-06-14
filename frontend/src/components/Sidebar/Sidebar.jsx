import styles from './Sidebar.module.css';
import { NavLink } from 'react-router-dom';
import {
  BooksIcon,
  HouseIcon,
  BookmarkSimpleIcon,
  HeartIcon,
  GearIcon,
} from '@phosphor-icons/react';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul>
          <li>
            <NavLink to="/" className={styles.navLink}>
              <span className={styles.icon}>
                <HouseIcon />
              </span>
              <span className={styles.label}>Home</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/shelves" className={styles.navLink}>
              <span className={styles.icon}>
                <BooksIcon />
              </span>
              <span className={styles.label}>Shelves</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/wishlist" className={styles.navLink}>
              <span className={styles.icon}>
                <BookmarkSimpleIcon />
              </span>
              <span className={styles.label}>Wish List</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/favorites" className={styles.navLink}>
              <span className={styles.icon}>
                <HeartIcon />
              </span>
              <span className={styles.label}>Favorites</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/settings" className={styles.navLink}>
              <span className={styles.icon}>
                <GearIcon />
              </span>
              <span className={styles.label}>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
