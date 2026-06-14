import styles from './Favorites.module.css';
import { useBooks } from '../../hooks/useBooks';
import BookCard from '../../components/BookCard/BookCard';
import { useOutletContext } from 'react-router-dom';
import ErrorState from '../../components/ErrorState/ErrorState';
import BookCardSkeleton from '../../components/BookCardSkeleton/BookCardSkeleton';
import { HeartIcon } from '@phosphor-icons/react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const Favorites = () => {
  useDocumentTitle('Favorites');

  const { onDeleteBook } = useOutletContext();

  const {
    data: booksResponse,
    isLoading,
    isError,
    refetch,
  } = useBooks({ favorite: true });

  const books = booksResponse?.data ?? [];
  const bookIds = books.map((book) => book.id);

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
      <ErrorState
        message="We couldn’t load your favorite books."
        onRetry={refetch}
      />
    );
  }

  return (
    <>
      <div className={styles.container}>
        {books.length === 0 && (
          <div className={styles.noBooks}>
            <HeartIcon className={styles.heartIcon} aria-hidden="true" />

            <h2>No favorites yet.</h2>

            <p>Save your favorite reads in one place.</p>
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

export default Favorites;
