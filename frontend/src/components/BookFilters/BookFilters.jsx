import { useEffect, useRef, useState } from 'react';
import { SlidersHorizontalIcon, CheckIcon, XIcon } from '@phosphor-icons/react';

import Modal from '../Modal/Modal';
import styles from './BookFilters.module.css';

const defaultFilters = {
  sort: 'created_asc',
  favoritesOnly: false,
  status: 'all',
};

const sortOptions = [
  { value: 'created_asc', label: 'Oldest added' },
  { value: 'created_desc', label: 'Newest added' },
  { value: 'updated_desc', label: 'Recently updated' },
  { value: 'title_asc', label: 'Title A-Z' },
  { value: 'title_desc', label: 'Title Z-A' },
  { value: 'author_asc', label: 'Author A-Z' },
  { value: 'author_desc', label: 'Author Z-A' },
];

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'finished', label: 'Finished' },
  { value: 'not_finished', label: 'Not finished' },
];

const BookFilters = ({ filters, onFiltersChange }) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState(filters);

  const filtersRef = useRef(null);

  const activeFiltersCount =
    Number(filters.favoritesOnly) + Number(filters.status !== 'all');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setIsFiltersOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const setFilters = (updater) => {
    onFiltersChange((currentFilters) =>
      typeof updater === 'function' ? updater(currentFilters) : updater,
    );
  };

  const handleOpenFilters = () => {
    if (window.innerWidth <= 850) {
      setDraftFilters(filters);
      setIsFiltersModalOpen(true);
      return;
    }

    setIsFiltersOpen((isOpen) => !isOpen);
  };

  const handleSortChange = (sort) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      sort,
    }));
  };

  const handleStatusChange = (status) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      status,
    }));
  };

  const handleFavoritesToggle = () => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      favoritesOnly: !currentFilters.favoritesOnly,
    }));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  const handleDraftSortChange = (sort) => {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      sort,
    }));
  };

  const handleDraftStatusChange = (status) => {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      status,
    }));
  };

  const handleDraftFavoritesToggle = () => {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      favoritesOnly: !currentFilters.favoritesOnly,
    }));
  };

  const handleResetDraftFilters = () => {
    setDraftFilters(defaultFilters);
  };

  const handleApplyDraftFilters = () => {
    onFiltersChange(draftFilters);
    setIsFiltersModalOpen(false);
  };

  return (
    <div ref={filtersRef} className={styles.filtersWrap}>
      <button
        type="button"
        className={`${styles.iconBtn} ${
          activeFiltersCount > 0 ? styles.iconBtnActive : ''
        }`}
        onClick={handleOpenFilters}
        aria-label="Open filters"
      >
        <SlidersHorizontalIcon />

        {activeFiltersCount > 0 && (
          <span className={styles.filterBadge}>{activeFiltersCount}</span>
        )}
      </button>

      {isFiltersOpen && (
        <div className={styles.filtersDropdown}>
          <div className={styles.dropdownHeader}>
            <div>
              <p className={styles.dropdownTitle}>Filters</p>
              <span className={styles.dropdownSubtitle}>
                Sort and narrow your library
              </span>
            </div>

            <button
              type="button"
              className={styles.resetBtn}
              onClick={handleResetFilters}
            >
              Reset
            </button>
          </div>

          <div className={styles.filterGroup}>
            <p className={styles.groupTitle}>Sort by</p>

            <div className={styles.optionList}>
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.optionBtn} ${
                    filters.sort === option.value ? styles.optionBtnActive : ''
                  }`}
                  onClick={() => handleSortChange(option.value)}
                >
                  <span>{option.label}</span>

                  {filters.sort === option.value && <CheckIcon weight="bold" />}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.filterGroup}>
            <p className={styles.groupTitle}>Filters</p>

            <button
              type="button"
              className={`${styles.toggleOption} ${
                filters.favoritesOnly ? styles.toggleOptionActive : ''
              }`}
              onClick={handleFavoritesToggle}
            >
              <span className={styles.checkbox}>
                {filters.favoritesOnly && <CheckIcon weight="bold" />}
              </span>

              <span>Favorites only</span>
            </button>
          </div>

          <div className={styles.filterGroup}>
            <p className={styles.groupTitle}>Status</p>

            <div className={styles.statusGrid}>
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.statusBtn} ${
                    filters.status === option.value
                      ? styles.statusBtnActive
                      : ''
                  }`}
                  onClick={() => handleStatusChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isFiltersModalOpen && (
        <Modal onClose={() => setIsFiltersModalOpen(false)}>
          <div className={styles.filtersModal}>
            <div className={styles.dropdownHeader}>
              <div>
                <p className={styles.dropdownTitle}>Filters</p>
                <span className={styles.dropdownSubtitle}>
                  Sort and narrow your library
                </span>
              </div>

              <div className={styles.dropdownHeaderActions}>
                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={handleResetDraftFilters}
                >
                  Reset
                </button>

                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setIsFiltersModalOpen(false)}
                  aria-label="Close filters"
                >
                  <XIcon size={18} weight="bold" />
                </button>
              </div>
            </div>

            <div className={styles.filterGroup}>
              <p className={styles.groupTitle}>Sort by</p>

              <div className={styles.optionList}>
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`${styles.optionBtn} ${
                      draftFilters.sort === option.value
                        ? styles.optionBtnActive
                        : ''
                    }`}
                    onClick={() => handleDraftSortChange(option.value)}
                  >
                    <span>{option.label}</span>

                    {draftFilters.sort === option.value && (
                      <CheckIcon weight="bold" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.filterGroup}>
              <p className={styles.groupTitle}>Filters</p>

              <button
                type="button"
                className={`${styles.toggleOption} ${
                  draftFilters.favoritesOnly ? styles.toggleOptionActive : ''
                }`}
                onClick={handleDraftFavoritesToggle}
              >
                <span className={styles.checkbox}>
                  {draftFilters.favoritesOnly && <CheckIcon weight="bold" />}
                </span>

                <span>Favorites only</span>
              </button>
            </div>

            <div className={styles.filterGroup}>
              <p className={styles.groupTitle}>Status</p>

              <div className={styles.statusGrid}>
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`${styles.statusBtn} ${
                      draftFilters.status === option.value
                        ? styles.statusBtnActive
                        : ''
                    }`}
                    onClick={() => handleDraftStatusChange(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className={styles.applyFiltersBtn}
              onClick={handleApplyDraftFilters}
            >
              Apply filters
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BookFilters;
