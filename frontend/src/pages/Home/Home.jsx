import styles from './Home.module.css';
import { useBooks } from '../../hooks/useBooks';
import BookCard from '../../components/BookCard/BookCard';
import { useOutletContext } from 'react-router-dom';
import AddBtn from '../../components/AddBtn/AddBtn';
import { IoBookOutline } from 'react-icons/io5';
import ErrorState from '../../components/ErrorState/ErrorState';
import BookCardSkeleton from '../../components/BookCardSkeleton/BookCardSkeleton';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const Home = () => {
  useDocumentTitle('Home');

  const { onDeleteBook, onAddBook, bookControls, setBookControls } =
    useOutletContext();

  const {
    data: booksResponse,
    isLoading,
    isError,
    refetch,
  } = useBooks({
    list_type: 'owned',
    sort: bookControls.sort,
    favorite: bookControls.favoritesOnly ? true : undefined,
    status: bookControls.status !== 'all' ? bookControls.status : undefined,
  });

  const books = booksResponse?.data ?? [];
  const bookIds = books.map((book) => book.id);

  const libraryTotalCount = booksResponse?.totalCount ?? 0;
  const filteredCount = booksResponse?.filteredCount ?? books.length;

  const fiction = books.filter((book) => book.category === 'fiction').length;
  const nonfiction = books.filter(
    (book) => book.category === 'nonfiction',
  ).length;
  const finished = books.filter((book) => book.status === 'finished').length;
  const notFinished = books.filter(
    (book) => book.status === 'not_finished',
  ).length;

  const hasActiveFilters =
    bookControls.favoritesOnly || bookControls.status !== 'all';

  const handleResetFilters = () => {
    setBookControls({
      sort: 'created_asc',
      favoritesOnly: false,
      status: 'all',
    });
  };

  const handleClearFavoriteFilter = () => {
    setBookControls((currentControls) => ({
      ...currentControls,
      favoritesOnly: false,
    }));
  };

  const handleClearStatusFilter = () => {
    setBookControls((currentControls) => ({
      ...currentControls,
      status: 'all',
    }));
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        {Array.from({ length: 6 }).map((_, index) => (
          <BookCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState message="We couldn’t load your books." onRetry={refetch} />
    );
  }

  return (
    <>
      {hasActiveFilters && (
        <div className={styles.activeFilters}>
          {bookControls.favoritesOnly && (
            <button
              type="button"
              className={styles.filterChip}
              onClick={handleClearFavoriteFilter}
            >
              Favorites
              <span>×</span>
            </button>
          )}

          {bookControls.status !== 'all' && (
            <button
              type="button"
              className={styles.filterChip}
              onClick={handleClearStatusFilter}
            >
              {bookControls.status === 'finished' ? 'Finished' : 'Not finished'}
              <span>×</span>
            </button>
          )}

          <button
            type="button"
            className={styles.clearAllFilters}
            onClick={handleResetFilters}
          >
            Clear all
          </button>
        </div>
      )}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Books</span>
          <strong className={styles.statValue}>{filteredCount}</strong>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Finished</span>
          <strong className={styles.statValue}>{finished}</strong>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Unfinished</span>
          <strong className={styles.statValue}>{notFinished}</strong>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Fiction</span>
          <strong className={styles.statValue}>{fiction}</strong>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Nonfiction</span>
          <strong className={styles.statValue}>{nonfiction}</strong>
        </div>
      </div>

      <div className={styles.container}>
        {books.length === 0 && libraryTotalCount > 0 && (
          <div className={styles.noBooks}>
            <IoBookOutline className={styles.bookIcon} />

            <h2>No matching books</h2>

            <p>No books in your library match the selected filters.</p>

            <button
              type="button"
              className={styles.clearFiltersBtn}
              onClick={handleResetFilters}
            >
              Clear filters
            </button>
          </div>
        )}

        {books.length === 0 && libraryTotalCount === 0 && (
          <div className={styles.noBooks}>
            <IoBookOutline className={styles.bookIcon} aria-hidden="true" />

            <h2>Your library is empty</h2>

            <p>Start building your personal collection.</p>

            <AddBtn text="Add your first book" onClick={onAddBook} />
          </div>
        )}

        {books.map((book) => (
          <BookCard
            book={book}
            bookIds={bookIds}
            key={book.id}
            onDeleteBook={onDeleteBook}
          />
        ))}
      </div>
    </>
  );
};

export default Home;
