import { BooksIcon } from '@phosphor-icons/react';
import { useOutletContext } from 'react-router-dom';

import AddBtn from '../../components/AddBtn/AddBtn';
import ErrorState from '../../components/ErrorState/ErrorState';
import { useShelves, useDeleteShelf } from '../../hooks/useShelves';
import { useState } from 'react';
import Modal from '../../components/Modal/Modal';
import AddBooksToShelf from '../../components/AddBooksToShelf/AddBooksToShelf';

import styles from './Shelves.module.css';
import ShelfCard from '../../components/ShelfCard/ShelfCard';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';
import toast from 'react-hot-toast';
import ShelfForm from '../../components/ShelfForm/ShelfForm';
import ShelfCardSkeleton from '../../components/ShelfCardSkeleton/ShelfCardSkeleton';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const Shelves = () => {
  useDocumentTitle('Shelves');
  const { onAddShelf } = useOutletContext();

  const { data: shelves = [], isLoading, isError, refetch } = useShelves();
  const deleteShelfMutation = useDeleteShelf();

  const [selectedShelf, setSelectedShelf] = useState(null);
  const [isAddBooksOpen, setIsAddBooksOpen] = useState(false);
  const [selectedShelfToDelete, setSelectedShelfToDelete] = useState(null);
  const [selectedShelfToRename, setSelectedShelfToRename] = useState(null);

  const handleOpenAddBooksModal = (shelf) => {
    setSelectedShelf(shelf);
    setIsAddBooksOpen(true);
  };

  const handleCloseAddBooksModal = () => {
    setSelectedShelf(null);
    setIsAddBooksOpen(false);
  };

  const handleOpenDeleteShelfModal = (shelf) => {
    setSelectedShelfToDelete(shelf);
  };

  const handleCloseDeleteShelfModal = () => {
    setSelectedShelfToDelete(null);
  };

  const handleOpenRenameShelfModal = (shelf) => {
    setSelectedShelfToRename(shelf);
  };

  const handleCloseRenameShelfModal = () => {
    setSelectedShelfToRename(null);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        {Array.from({ length: 4 }).map((_, index) => (
          <ShelfCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState message="We couldn’t load your shelves." onRetry={refetch} />
    );
  }

  return (
    <div className={styles.container}>
      {shelves.length === 0 && (
        <div className={styles.noBooks}>
          <BooksIcon className={styles.booksIcon} aria-hidden="true" />

          <h2>No shelves yet</h2>

          <p>Create shelves to organize your books.</p>

          <AddBtn text="Add your first shelf" onClick={onAddShelf} />
        </div>
      )}

      {shelves.map((shelf) => (
        <ShelfCard
          key={shelf.id}
          shelf={shelf}
          onAddBooks={handleOpenAddBooksModal}
          onDeleteShelf={handleOpenDeleteShelfModal}
          onRenameShelf={handleOpenRenameShelfModal}
        />
      ))}

      {isAddBooksOpen && selectedShelf && (
        <Modal onClose={handleCloseAddBooksModal}>
          <AddBooksToShelf
            shelf={selectedShelf}
            onClose={handleCloseAddBooksModal}
          />
        </Modal>
      )}

      {selectedShelfToDelete && (
        <Modal onClose={handleCloseDeleteShelfModal}>
          <ConfirmDelete
            title={selectedShelfToDelete.name}
            message="Are you sure you want to delete this shelf? Books on this shelf will stay in your library."
            loading={deleteShelfMutation.isPending}
            onCancel={handleCloseDeleteShelfModal}
            onConfirm={async () => {
              try {
                await deleteShelfMutation.mutateAsync(selectedShelfToDelete.id);
                handleCloseDeleteShelfModal();
                toast.success('Shelf deleted');
              } catch (error) {
                toast.error(error.message);
              }
            }}
          />
        </Modal>
      )}

      {selectedShelfToRename && (
        <Modal onClose={handleCloseRenameShelfModal}>
          <ShelfForm
            mode="edit"
            shelf={selectedShelfToRename}
            onClose={handleCloseRenameShelfModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default Shelves;
