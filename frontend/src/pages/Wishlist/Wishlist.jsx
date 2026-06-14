import styles from './Wishlist.module.css';
import { useBooks } from '../../hooks/useBooks';
import BookCard from '../../components/BookCard/BookCard';
import { useOutletContext } from 'react-router-dom';
import AddBtn from '../../components/AddBtn/AddBtn';
import ErrorState from '../../components/ErrorState/ErrorState';
import BookCardSkeleton from '../../components/BookCardSkeleton/BookCardSkeleton';
import { BookmarkSimpleIcon } from '@phosphor-icons/react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const Wishlist = () => {
  useDocumentTitle('Wishlist');
  const { onDeleteBook, onAddBook } = useOutletContext();
  const {
    data: booksResponse,
    isLoading,
    isError,
    refetch,
  } = useBooks({ list_type: 'wishlist' });

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
      <ErrorState message="We couldn’t load your wishlist." onRetry={refetch} />
    );
  }

  return (
    <>
      <div className={styles.container}>
        {books.length === 0 && (
          <div className={styles.noBooks}>
            <BookmarkSimpleIcon
              className={styles.bookmarkIcon}
              aria-hidden="true"
            />

            <h2>Your wishlist is empty</h2>

            <p>Save books you want to read later.</p>

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

export default Wishlist;
