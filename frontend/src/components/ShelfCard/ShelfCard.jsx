import { useNavigate } from 'react-router-dom';
import {
  TrashSimpleIcon,
  NotePencilIcon,
  PlusCircleIcon,
} from '@phosphor-icons/react';
import { IoBookOutline } from 'react-icons/io5';
import { useShelfBooks } from '../../hooks/useShelves';

import styles from './ShelfCard.module.css';

const ShelfCard = ({ shelf, onAddBooks, onDeleteShelf, onRenameShelf }) => {
  const navigate = useNavigate();

  const { data: books = [], isLoading } = useShelfBooks(shelf.id, {
    limit: 3,
  });

  const bookCount = shelf.book_count ?? 0;
  const hasBooks = books.length > 0;

  const handleOpenShelf = () => {
    navigate(`/shelves/${shelf.id}`);
  };

  const handleAddBooks = (e) => {
    e.stopPropagation();
    onAddBooks(shelf);
  };

  const handleDeleteShelf = (e) => {
    e.stopPropagation();
    onDeleteShelf(shelf);
  };

  const handleRenameShelf = (e) => {
    e.stopPropagation();
    onRenameShelf(shelf);
  };

  return (
    <div
      className={`${styles.shelf} ${!hasBooks ? styles.emptyShelf : ''}`}
      onClick={handleOpenShelf}
    >
      <div className={styles.header}>
        <h3>{shelf.name}</h3>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={handleRenameShelf}
            aria-label={`Rename ${shelf.name}`}
          >
            <NotePencilIcon size={22} />
          </button>

          <button
            type="button"
            className={styles.actionBtn}
            onClick={handleDeleteShelf}
            aria-label={`Delete ${shelf.name}`}
          >
            <TrashSimpleIcon size={22} />
          </button>
        </div>
      </div>

      <div className={`${styles.books} ${!hasBooks ? styles.emptyBooks : ''}`}>
        {!isLoading &&
          books.map((book) => (
            <div className={styles.book} key={book.id}>
              {book.image_source_url ? (
                <img src={book.image_source_url} alt={`${book.title} cover`} />
              ) : (
                <IoBookOutline
                  className={styles.placeholderIcon}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}

        <button
          type="button"
          className={`${styles.addBookBtn} ${
            !hasBooks ? styles.emptyAddBtn : ''
          }`}
          onClick={handleAddBooks}
          aria-label={`Add books to ${shelf.name}`}
        >
          <PlusCircleIcon size={32} />
        </button>
      </div>

      <p className={styles.count}>
        {bookCount} {bookCount === 1 ? 'book' : 'books'}
      </p>
    </div>
  );
};

export default ShelfCard;
