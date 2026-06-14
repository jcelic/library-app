import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react';
import styles from './BookSearch.module.css';
import { useSearchBooks } from '../../hooks/useBooks';

const BookSearch = ({
  placeholder = 'Search books...',
  variant = 'dropdown',
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const trimmedQuery = debouncedQuery.trim();

  const showResults =
    variant === 'modal'
      ? trimmedQuery.length >= 2
      : isFocused && trimmedQuery.length >= 2;

  const { data: results = [], isLoading } = useSearchBooks(trimmedQuery);

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    setIsFocused(true);
  };

  const handleSelectBook = (book) => {
    const from = location.pathname + location.search;
    const bookIds = results.map((result) => result.id);

    setQuery('');
    setIsFocused(false);
    onClose?.();

    navigate(`/details/${book.id}`, {
      state: { from, bookIds },
    });
  };

  return (
    <div className={`${styles.searchBox} ${styles[variant]}`}>
      {variant === 'modal' && (
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close search"
        >
          <XIcon size={18} weight="bold" />
        </button>
      )}

      <div className={styles.searchWrapper}>
        <MagnifyingGlassIcon
          size={20}
          weight="bold"
          className={styles.icon}
          aria-hidden="true"
        />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            if (variant === 'dropdown') {
              setTimeout(() => setIsFocused(false), 120);
            }
          }}
          placeholder={placeholder}
          className={styles.input}
          autoFocus={variant === 'modal'}
        />

        {query.length > 0 && (
          <button
            type="button"
            className={styles.clearBtn}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClear}
            aria-label="Clear search"
          >
            <XIcon />
          </button>
        )}
      </div>

      {showResults && (
        <div className={styles.results}>
          {isLoading && <div className={styles.empty}>Searching...</div>}

          {!isLoading &&
            results.map((book) => (
              <button
                key={book.id}
                type="button"
                className={styles.result}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelectBook(book)}
              >
                <div className={styles.info}>
                  <p className={styles.title}>{book.title}</p>
                  <span className={styles.meta}>
                    {book.author} ·{' '}
                    <span className={styles.metaType}>
                      {book.list_type === 'wishlist' ? 'Wishlist' : 'Owned'}
                    </span>
                  </span>
                </div>
              </button>
            ))}

          {!isLoading && results.length === 0 && (
            <div className={styles.empty}>No books found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookSearch;
