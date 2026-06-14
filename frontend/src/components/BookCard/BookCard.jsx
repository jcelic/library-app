import styles from './BookCard.module.css';
import { IoBookOutline } from 'react-icons/io5';
import {
  HeartIcon,
  TrashSimpleIcon,
  CheckCircleIcon,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMoveToOwned, useToggleFavorite } from '../../hooks/useBooks';
import { BookPlus } from 'lucide-react';

const BookCard = ({ book, bookIds, onDeleteBook, onRemoveFromShelf }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.pathname + location.search;
  const toggleFavoriteMutation = useToggleFavorite();
  const moveToOwnedMutation = useMoveToOwned();

  const handleOpenDetails = () => {
    navigate(`/details/${book.id}`, {
      state: { from, bookIds },
    });
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();

    if (onRemoveFromShelf) {
      onRemoveFromShelf(book);
      return;
    }

    onDeleteBook(book);
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    try {
      await toggleFavoriteMutation.mutateAsync(book.id);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleMoveToOwned = async (e) => {
    e.stopPropagation();
    try {
      await moveToOwnedMutation.mutateAsync(book.id);
      toast.success('Book moved to owned books');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.card} onClick={handleOpenDetails}>
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

      <div className={styles.info}>
        <h3>{book.title}</h3>
        <p>{book.author}</p>
      </div>

      <div className={styles.options}>
        {location.pathname !== '/wishlist' && (
          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-label={
              book.is_favorite ? 'Remove from favorites' : 'Add to favorites'
            }
          >
            {book.is_favorite ? (
              <HeartIcon size={25} weight="fill" />
            ) : (
              <HeartIcon size={25} />
            )}
          </button>
        )}

        {location.pathname === '/wishlist' && (
          <button
            type="button"
            onClick={handleMoveToOwned}
            aria-label="Move to owned books"
          >
            <BookPlus size={22} strokeWidth={1.7} />
          </button>
        )}

        <button
          type="button"
          className={styles.deleteBtn}
          onClick={handleDeleteClick}
          aria-label={
            onRemoveFromShelf ? 'Remove book from shelf' : 'Delete book'
          }
        >
          <TrashSimpleIcon size={25} />
        </button>

        {book.status === 'finished' && (
          <span className={styles.finished}>
            <CheckCircleIcon size={25} />
          </span>
        )}
      </div>
    </div>
  );
};

export default BookCard;
