import { useState } from 'react';
import { IoBook } from 'react-icons/io5';
import {
  UserIcon,
  SignOutIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react';
import { Link, useLocation } from 'react-router-dom';

import AddBtn from '../AddBtn/AddBtn';
import BookSearch from '../BookSearch/BookSearch';
import Modal from '../Modal/Modal';
import BookFilters from '../BookFilters/BookFilters';

import styles from './Header.module.css';

const Header = ({ onAddBook, showHeaderAddBtn, filters, onFiltersChange }) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const location = useLocation();

  const showFiltersButton = location.pathname === '/';

  const showAddBtn =
    (location.pathname === '/' ||
      location.pathname === '/wishlist' ||
      location.pathname === '/shelves') &&
    showHeaderAddBtn;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} aria-label="Go to home page">
          <IoBook />
        </Link>

        <div className={styles.center}>
          <div className={styles.searchInput}>
            <BookSearch
              key={`${location.pathname}${location.search}`}
              variant="dropdown"
            />
          </div>

          <button
            type="button"
            className={`${styles.iconBtn} ${styles.mobileSearchBtn}`}
            onClick={() => setIsSearchModalOpen(true)}
            aria-label="Open search"
          >
            <MagnifyingGlassIcon />
          </button>

          {showAddBtn && (
            <div className={styles.addBtnWrap}>
              <AddBtn
                onClick={onAddBook}
                text={
                  location.pathname === '/shelves' ? 'Add Shelf' : 'Add Book'
                }
              />
            </div>
          )}

          {showFiltersButton && (
            <BookFilters filters={filters} onFiltersChange={onFiltersChange} />
          )}
        </div>

        <div className={styles.right}>
          <div className={styles.user}>
            <span className={styles.userIcon}>
              <UserIcon />
            </span>
            <span className={styles.userName}>John Doe</span>
          </div>

          <div className={styles.logout}>
            <button type="button" aria-label="Sign out">
              <SignOutIcon />
            </button>
          </div>
        </div>
      </div>

      {isSearchModalOpen && (
        <Modal onClose={() => setIsSearchModalOpen(false)}>
          <BookSearch
            variant="modal"
            onClose={() => setIsSearchModalOpen(false)}
          />
        </Modal>
      )}
    </header>
  );
};

export default Header;
