import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styles from './BookDetails.module.css';
import { IoBookOutline } from 'react-icons/io5';
import Modal from '../../components/Modal/Modal';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';

import {
  HeartIcon,
  TrashSimpleIcon,
  NotePencilIcon,
  StackPlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  CaretLeftIcon,
  CaretRightIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react';
import {
  useBook,
  useDeleteBook,
  useMoveToOwned,
  useToggleFavorite,
} from '../../hooks/useBooks';
import { useState } from 'react';
import toast from 'react-hot-toast';
import BookForm from '../../components/BookForm/BookForm';
import { BookPlus } from 'lucide-react';
import BookDetailsSkeleton from '../../components/BookDetailsSkeleton/BookDetailsSkeleton';
import ShelfPicker from '../../components/ShelfPicker/ShelfPicker';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const BookDetails = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [shelfPickerOpen, setShelfPickerOpen] = useState(false);
  const [editFormCloseRequest, setEditFormCloseRequest] = useState(0);

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from || '/';
  const bookIds = location.state?.bookIds ?? [];

  const { data: book, isLoading, isError, isFetching, refetch } = useBook(id);

  useDocumentTitle(book?.title ?? 'Book Details');

  const deleteBookMutation = useDeleteBook();
  const toggleFavoriteMutation = useToggleFavorite();
  const moveToOwnedMutation = useMoveToOwned();

  const currentIndex = bookIds.findIndex(
    (bookId) => String(bookId) === String(id),
  );

  const previousBookId = currentIndex > 0 ? bookIds[currentIndex - 1] : null;

  const nextBookId =
    currentIndex >= 0 && currentIndex < bookIds.length - 1
      ? bookIds[currentIndex + 1]
      : null;

  const handlePreviousBook = () => {
    if (!previousBookId) return;

    navigate(`/details/${previousBookId}`, {
      state: {
        from,
        bookIds,
      },
    });
  };

  const handleNextBook = () => {
    if (!nextBookId) return;

    navigate(`/details/${nextBookId}`, {
      state: {
        from,
        bookIds,
      },
    });
  };

  const handleToggleFavorite = async (book) => {
    try {
      await toggleFavoriteMutation.mutateAsync(book.id);

      if (from.startsWith('/favorites') && book.is_favorite) {
        const fallbackBookId = nextBookId || previousBookId;

        if (fallbackBookId) {
          navigate(`/details/${fallbackBookId}`, {
            state: {
              from,
              bookIds: bookIds.filter(
                (bookId) => String(bookId) !== String(book.id),
              ),
            },
          });
        } else {
          navigate('/favorites');
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleMoveToOwned = async () => {
    try {
      await moveToOwnedMutation.mutateAsync(book.id);
      navigate('/');
      toast.success('Book moved to owned books');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const navigationButtons = (
    <div className={styles.navigation}>
      <button
        type="button"
        className={styles.navBtn}
        onClick={handlePreviousBook}
        disabled={!previousBookId}
        aria-label="Previous book"
      >
        <CaretLeftIcon size={28} weight="bold" />
      </button>

      <button
        type="button"
        className={styles.navBtn}
        onClick={handleNextBook}
        disabled={!nextBookId}
        aria-label="Next book"
      >
        <CaretRightIcon size={28} weight="bold" />
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <>
        <div className={styles.topBar}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate(from)}
            aria-label="Go back"
          >
            <CaretLeftIcon />
            Back
          </button>
        </div>

        <BookDetailsSkeleton />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <div className={styles.topBar}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate(from)}
            aria-label="Go back"
          >
            <CaretLeftIcon />
            Back
          </button>
        </div>

        <div className={styles.container}>
          <div className={styles.errorCard}>
            <WarningCircleIcon size={64} className={styles.errorIcon} />

            <h2>Something went wrong</h2>

            <p>We couldn’t load this book.</p>

            <button
              className={styles.retryBtn}
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? 'Retrying...' : 'Try again'}
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <>
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate(from)}
          aria-label="Go back"
        >
          <CaretLeftIcon />
          Back
        </button>
      </div>

      <div className={styles.container}>
        <div className={styles.detailsWrapper}>
          <div className={styles.desktopNav}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={handlePreviousBook}
              disabled={!previousBookId}
              aria-label="Previous book"
            >
              <CaretLeftIcon size={28} weight="bold" />
            </button>
          </div>

          <div className={styles.card}>
            <div className={styles.img}>
              {book.image_source_url ? (
                <img src={book.image_source_url} alt={`${book.title} cover`} />
              ) : (
                <IoBookOutline
                  className={styles.placeholderIcon}
                  aria-hidden="true"
                />
              )}
            </div>

            <div className={styles['info-container']}>
              <div className={styles.info}>
                <h3>{book.title}</h3>

                <h4>{book.subtitle}</h4>

                <h5>{book.author}</h5>

                <div className={styles['info-tags']}>
                  <span>{book.category}</span>

                  {book.list_type !== 'wishlist' && (
                    <span
                      style={{
                        background:
                          book.status === 'finished'
                            ? 'rgb(195, 248, 195)'
                            : 'rgb(249, 199, 199)',
                      }}
                    >
                      {book.status === 'finished' ? (
                        <>
                          finished <CheckCircleIcon size={19} />
                        </>
                      ) : (
                        <>
                          not finished <XCircleIcon size={19} />
                        </>
                      )}
                    </span>
                  )}
                </div>

                <div className={styles.options}>
                  {book.list_type !== 'wishlist' && (
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(book)}
                      disabled={toggleFavoriteMutation.isPending}
                      aria-label={
                        book.is_favorite
                          ? 'Remove from favorites'
                          : 'Add to favorites'
                      }
                    >
                      {book.is_favorite ? (
                        <HeartIcon size={25} weight="fill" />
                      ) : (
                        <HeartIcon size={25} />
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setEditModalOpen(true)}
                    aria-label="Edit book"
                  >
                    <NotePencilIcon size={25} />
                  </button>

                  {book.list_type === 'owned' && (
                    <button
                      type="button"
                      onClick={() => setShelfPickerOpen(true)}
                      aria-label="Add book to shelf"
                    >
                      <StackPlusIcon size={25} />
                    </button>
                  )}

                  {book.list_type === 'wishlist' && (
                    <button
                      type="button"
                      onClick={handleMoveToOwned}
                      disabled={moveToOwnedMutation.isPending}
                      aria-label="Move to owned books"
                    >
                      <BookPlus size={22} strokeWidth={1.7} />
                    </button>
                  )}

                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => setDeleteModalOpen(true)}
                    aria-label="Delete book"
                  >
                    <TrashSimpleIcon size={25} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.desktopNav}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={handleNextBook}
              disabled={!nextBookId}
              aria-label="Next book"
            >
              <CaretRightIcon size={28} weight="bold" />
            </button>
          </div>

          {navigationButtons}
        </div>
      </div>

      {deleteModalOpen && (
        <Modal onClose={() => setDeleteModalOpen(false)}>
          <ConfirmDelete
            title={book.title}
            message="Are you sure you want to delete this book?"
            loading={deleteBookMutation.isPending}
            onCancel={() => setDeleteModalOpen(false)}
            onConfirm={async () => {
              try {
                await deleteBookMutation.mutateAsync(book.id);
                setDeleteModalOpen(false);
                navigate(from || '/');
                toast.success('Book deleted');
              } catch (error) {
                toast.error(error.message);
              }
            }}
          />
        </Modal>
      )}

      {editModalOpen && (
        <Modal onClose={() => setEditFormCloseRequest((value) => value + 1)}>
          <BookForm
            mode="edit"
            book={book}
            onClose={() => setEditModalOpen(false)}
            closeRequestSignal={editFormCloseRequest}
          />
        </Modal>
      )}

      {shelfPickerOpen && (
        <Modal onClose={() => setShelfPickerOpen(false)}>
          <ShelfPicker book={book} onClose={() => setShelfPickerOpen(false)} />
        </Modal>
      )}
    </>
  );
};

export default BookDetails;
