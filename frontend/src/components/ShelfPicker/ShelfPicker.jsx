import { useState } from 'react';
import toast from 'react-hot-toast';

import {
  useAddBookToShelf,
  useBookShelves,
  useCreateShelf,
  useShelves,
} from '../../hooks/useShelves';

import styles from './ShelfPicker.module.css';

import { XIcon } from '@phosphor-icons/react';

const ShelfPicker = ({ book, onClose }) => {
  const [newShelfName, setNewShelfName] = useState('');

  const {
    data: shelves = [],
    isLoading: isShelvesLoading,
    isError,
    refetch,
  } = useShelves();

  const { data: bookShelves = [], isLoading: isBookShelvesLoading } =
    useBookShelves(book.id);

  const createShelfMutation = useCreateShelf();
  const addBookToShelfMutation = useAddBookToShelf();

  const isPending =
    createShelfMutation.isPending || addBookToShelfMutation.isPending;

  const isLoadingShelves = isShelvesLoading || isBookShelvesLoading;

  const availableShelves = shelves.filter(
    (shelf) => !bookShelves.some((bookShelf) => bookShelf.id === shelf.id),
  );

  const handleAddToShelf = async (shelf) => {
    try {
      await addBookToShelfMutation.mutateAsync({
        shelfId: shelf.id,
        bookId: book.id,
      });

      toast.success(`Book added to "${shelf.name}"`);
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCreateShelfAndAddBook = async (e) => {
    e.preventDefault();

    const trimmedName = newShelfName.trim();

    if (!trimmedName) {
      toast.error('Shelf name is required');
      return;
    }

    try {
      const createdShelf = await createShelfMutation.mutateAsync({
        name: trimmedName,
      });

      await addBookToShelfMutation.mutateAsync({
        shelfId: createdShelf.id,
        bookId: book.id,
      });

      toast.success('Shelf created and book added');
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h2>Add to shelf</h2>
          <p>{book.title}</p>
        </div>

        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          <XIcon size={18} weight="bold" />
        </button>
      </div>

      <div className={styles.section}>
        {!isLoadingShelves && availableShelves.length > 0 && (
          <h3>Choose existing shelf</h3>
        )}

        {isLoadingShelves && (
          <p className={styles.message}>Loading shelves...</p>
        )}

        {isError && (
          <div className={styles.error}>
            <p>Failed to load shelves.</p>

            <button type="button" onClick={refetch}>
              Try again
            </button>
          </div>
        )}

        {!isLoadingShelves && !isError && shelves.length === 0 && (
          <p className={styles.message}>You don&apos;t have any shelves yet.</p>
        )}

        {!isLoadingShelves &&
          !isError &&
          shelves.length > 0 &&
          availableShelves.length === 0 && (
            <p className={styles.message}>
              This book is already on all your shelves.
            </p>
          )}

        {!isLoadingShelves && !isError && availableShelves.length > 0 && (
          <div className={styles.shelfList}>
            {availableShelves.map((shelf) => (
              <button
                key={shelf.id}
                type="button"
                className={styles.shelfBtn}
                onClick={() => handleAddToShelf(shelf)}
                disabled={isPending}
              >
                <span>{shelf.name}</span>

                <small>
                  {shelf.book_count ?? 0}{' '}
                  {(shelf.book_count ?? 0) === 1 ? 'book' : 'books'}
                </small>
              </button>
            ))}
          </div>
        )}
      </div>

      <form className={styles.section} onSubmit={handleCreateShelfAndAddBook}>
        <h3>Create new shelf</h3>

        <div className={styles.inputGroup}>
          <label htmlFor="new-shelf-name">Shelf name</label>

          <input
            id="new-shelf-name"
            type="text"
            value={newShelfName}
            onChange={(e) => setNewShelfName(e.target.value)}
            placeholder="e.g. Philosophy"
            disabled={isPending}
            autoComplete="off"
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isPending}>
          {isPending ? 'Saving...' : 'Create shelf and add book'}
        </button>
      </form>
    </div>
  );
};

export default ShelfPicker;
