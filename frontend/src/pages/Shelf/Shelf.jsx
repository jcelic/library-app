import { useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import {
  BooksIcon,
  CaretLeftIcon,
  NotePencilIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

import BookCard from '../../components/BookCard/BookCard';
import ErrorState from '../../components/ErrorState/ErrorState';
import AddBtn from '../../components/AddBtn/AddBtn';
import Modal from '../../components/Modal/Modal';
import AddBooksToShelf from '../../components/AddBooksToShelf/AddBooksToShelf';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';
import ShelfForm from '../../components/ShelfForm/ShelfForm';

import {
  useDeleteShelf,
  useRemoveBookFromShelf,
  useShelfBooks,
  useShelves,
} from '../../hooks/useShelves';

import styles from './Shelf.module.css';
import BookCardSkeleton from '../../components/BookCardSkeleton/BookCardSkeleton';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const Shelf = () => {
  const { id } = useParams();
  const { onDeleteBook } = useOutletContext();
  const navigate = useNavigate();

  const [isAddBooksOpen, setIsAddBooksOpen] = useState(false);
  const [isRenameShelfOpen, setIsRenameShelfOpen] = useState(false);
  const [isDeleteShelfOpen, setIsDeleteShelfOpen] = useState(false);
  const [selectedBookToRemove, setSelectedBookToRemove] = useState(null);

  const removeBookFromShelfMutation = useRemoveBookFromShelf();
  const deleteShelfMutation = useDeleteShelf();

  const { data: shelves = [], isLoading: isShelvesLoading } = useShelves();

  const {
    data: books = [],
    isLoading: isBooksLoading,
    isError,
    refetch,
  } = useShelfBooks(id);

  const shelf = shelves.find((shelf) => shelf.id === id);
  const bookCount = books.length;

  const bookIds = books.map((book) => book.id);

  useDocumentTitle(shelf ? `${shelf.name} shelf` : 'Shelf');

  const handleBack = () => {
    navigate('/shelves');
  };

  const handleOpenAddBooksModal = () => {
    setIsAddBooksOpen(true);
  };

  const handleCloseAddBooksModal = () => {
    setIsAddBooksOpen(false);
  };

  const handleOpenRenameShelfModal = () => {
    setIsRenameShelfOpen(true);
  };

  const handleCloseRenameShelfModal = () => {
    setIsRenameShelfOpen(false);
  };

  const handleOpenDeleteShelfModal = () => {
    setIsDeleteShelfOpen(true);
  };

  const handleCloseDeleteShelfModal = () => {
    setIsDeleteShelfOpen(false);
  };

  const handleOpenRemoveFromShelfModal = (book) => {
    setSelectedBookToRemove(book);
  };

  const handleCloseRemoveFromShelfModal = () => {
    setSelectedBookToRemove(null);
  };

  if (isShelvesLoading || isBooksLoading) {
    return (
      <div className={styles.container}>
        {Array.from({ length: 6 }).map((_, index) => (
          <BookCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError || !shelf) {
    return (
      <ErrorState message="We couldn’t load your shelf." onRetry={refetch} />
    );
  }

  return (
    <>
      <div className={styles.pageTop}>
        <button type="button" className={styles.backBtn} onClick={handleBack}>
          <CaretLeftIcon />
          Back
        </button>

        <div className={styles.shelfHeader}>
          <div className={styles.shelfInfo}>
            <h1>{shelf.name}</h1>

            <p>
              {bookCount} {bookCount === 1 ? 'book' : 'books'}
            </p>
          </div>

          <div className={styles.shelfActions}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={handleOpenRenameShelfModal}
              aria-label={`Rename ${shelf.name}`}
            >
              <NotePencilIcon size={22} />
            </button>

            <button
              type="button"
              className={styles.iconBtn}
              onClick={handleOpenDeleteShelfModal}
              aria-label={`Delete ${shelf.name}`}
            >
              <TrashIcon size={22} />
            </button>

            {bookCount > 0 && (
              <AddBtn text="Add Books" onClick={handleOpenAddBooksModal} />
            )}
          </div>
        </div>
      </div>

      <div className={styles.container}>
        {bookCount === 0 && (
          <div className={styles.noBooks}>
            <BooksIcon className={styles.bookmarkIcon} aria-hidden="true" />

            <h2>{shelf.name} shelf is empty</h2>

            <p>Add your first book to this shelf.</p>

            <AddBtn text="Add Books" onClick={handleOpenAddBooksModal} />
          </div>
        )}

        {books.map((book) => (
          <BookCard
            book={book}
            bookIds={bookIds}
            key={book.id}
            onDeleteBook={onDeleteBook}
            onRemoveFromShelf={handleOpenRemoveFromShelfModal}
          />
        ))}
      </div>

      {isAddBooksOpen && (
        <Modal onClose={handleCloseAddBooksModal}>
          <AddBooksToShelf shelf={shelf} onClose={handleCloseAddBooksModal} />
        </Modal>
      )}

      {isRenameShelfOpen && (
        <Modal onClose={handleCloseRenameShelfModal}>
          <ShelfForm
            mode="edit"
            shelf={shelf}
            onClose={handleCloseRenameShelfModal}
          />
        </Modal>
      )}

      {isDeleteShelfOpen && (
        <Modal onClose={handleCloseDeleteShelfModal}>
          <ConfirmDelete
            title={shelf.name}
            message="Are you sure you want to delete this shelf? Books on this shelf will stay in your library."
            loading={deleteShelfMutation.isPending}
            onCancel={handleCloseDeleteShelfModal}
            onConfirm={async () => {
              try {
                await deleteShelfMutation.mutateAsync(shelf.id);
                handleCloseDeleteShelfModal();
                toast.success('Shelf deleted');
                navigate('/shelves');
              } catch (error) {
                toast.error(error.message);
              }
            }}
          />
        </Modal>
      )}

      {selectedBookToRemove && (
        <Modal onClose={handleCloseRemoveFromShelfModal}>
          <ConfirmDelete
            title={selectedBookToRemove.title}
            message={`Remove this book from "${shelf.name}"? It will stay in your library.`}
            loading={removeBookFromShelfMutation.isPending}
            onCancel={handleCloseRemoveFromShelfModal}
            onConfirm={async () => {
              try {
                await removeBookFromShelfMutation.mutateAsync({
                  shelfId: shelf.id,
                  bookId: selectedBookToRemove.id,
                });

                handleCloseRemoveFromShelfModal();
                toast.success('Book removed from shelf');
              } catch (error) {
                toast.error(error.message);
              }
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default Shelf;
