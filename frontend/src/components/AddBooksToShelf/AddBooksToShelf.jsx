import { useState } from 'react';
import toast from 'react-hot-toast';
import { CiImageOff } from 'react-icons/ci';
import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react';

import { useBooks } from '../../hooks/useBooks';
import { useAddBookToShelf, useShelfBooks } from '../../hooks/useShelves';

import styles from './AddBooksToShelf.module.css';

const AddBooksToShelf = ({ shelf, onClose }) => {
  const [addedBookIds, setAddedBookIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: booksResponse,
    isLoading,
    isError,
  } = useBooks({
    list_type: 'owned',
  });

  const books = booksResponse?.data ?? [];

  const filteredBooks = books.filter((book) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return true;

    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
  });

  const { data: shelfBooks = [], isLoading: isShelfBooksLoading } =
    useShelfBooks(shelf.id);

  const shelfBookIds = shelfBooks.map((book) => book.id);

  const addBookToShelfMutation = useAddBookToShelf();

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleAddBook = async (bookId) => {
    try {
      await addBookToShelfMutation.mutateAsync({
        shelfId: shelf.id,
        bookId,
      });

      setAddedBookIds((currentIds) => [...currentIds, bookId]);

      toast.success('Book added to shelf');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isLoading || isShelfBooksLoading) {
    return <p className={styles.message}>Loading books...</p>;
  }

  if (isError) {
    return <p className={styles.message}>Failed to load books.</p>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2>Add books to "{shelf.name}"</h2>

        <button
          type="button"
          onClick={onClose}
          className={styles.closeBtn}
          aria-label="Close"
        >
          <XIcon size={18} weight="bold" />
        </button>
      </div>

      <div className={styles.searchWrapper}>
        <MagnifyingGlassIcon size={20} weight="bold" className={styles.icon} />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search books..."
          className={styles.searchInput}
          autoFocus
        />

        {searchQuery.length > 0 && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            <XIcon />
          </button>
        )}
      </div>

      <div className={styles.list}>
        {filteredBooks.map((book) => {
          const isAdded =
            addedBookIds.includes(book.id) || shelfBookIds.includes(book.id);

          return (
            <div className={styles.row} key={book.id}>
              <div className={styles.cover}>
                {book.image_source_url ? (
                  <img
                    src={book.image_source_url}
                    alt={`${book.title} cover`}
                  />
                ) : (
                  <CiImageOff
                    className={styles.placeholderIcon}
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className={styles.info}>
                <h3>{book.title}</h3>
                <p>{book.author}</p>
              </div>

              <button
                type="button"
                className={styles.addBtn}
                onClick={() => handleAddBook(book.id)}
                disabled={isAdded || addBookToShelfMutation.isPending}
              >
                {isAdded ? 'Added' : 'Add'}
              </button>
            </div>
          );
        })}

        {filteredBooks.length === 0 && (
          <p className={styles.empty}>No books found.</p>
        )}
      </div>
    </div>
  );
};

export default AddBooksToShelf;
