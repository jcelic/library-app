import styles from './AppLayout.module.css';
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import Modal from '../../components/Modal/Modal';
import BookForm from '../../components/BookForm/BookForm';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';
import MobileNav from '../../components/MobileNav/MobileNav';

import { useDeleteBook, useBooks } from '../../hooks/useBooks';
import { useShelves } from '../../hooks/useShelves';

import ShelfForm from '../../components/ShelfForm/ShelfForm';
import ScrollToTopBtn from '../../components/ScrollToTopBtn/ScrollToTopBtn';

const AppLayout = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookFormCloseRequest, setBookFormCloseRequest] = useState(0);
  const [bookControls, setBookControls] = useState({
    sort: 'created_asc',
    favoritesOnly: false,
    status: 'all',
  });

  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isWishlistPage = location.pathname === '/wishlist';
  const isShelvesPage = location.pathname === '/shelves';

  const listType = isWishlistPage ? 'wishlist' : 'owned';

  const deleteBookMutation = useDeleteBook();

  const { data: headerBooksResponse, isLoading: isHeaderBooksLoading } =
    useBooks({
      list_type: isWishlistPage ? 'wishlist' : 'owned',
    });

  const headerBooks = headerBooksResponse?.data ?? [];
  const { data: shelves = [], isLoading: isShelvesLoading } = useShelves();

  const showHeaderAddBtn =
    (!isHeaderBooksLoading &&
      (isHomePage || isWishlistPage) &&
      headerBooks.length > 0) ||
    (!isShelvesLoading && isShelvesPage && shelves.length > 0);

  const handleHeaderAddClick = () => {
    if (isShelvesPage) {
      setActiveModal('create-shelf');
      return;
    }

    setActiveModal('create-book');
  };

  const handleOpenDeleteModal = (book) => {
    setSelectedBook(book);
    setActiveModal('delete');
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
    setActiveModal(null);
  };

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <Header
          onAddBook={handleHeaderAddClick}
          showHeaderAddBtn={showHeaderAddBtn}
          filters={bookControls}
          onFiltersChange={setBookControls}
        />
      </div>

      <div className={styles.sidebar}>
        <Sidebar />
      </div>

      <main className={styles.main}>
        <div className={styles.container}>
          <Outlet
            context={{
              onDeleteBook: handleOpenDeleteModal,
              onAddBook: () => setActiveModal('create-book'),
              onAddShelf: () => setActiveModal('create-shelf'),
              bookControls,
              setBookControls,
            }}
          />
        </div>
      </main>

      <MobileNav />
      <ScrollToTopBtn />

      {activeModal === 'create-book' && (
        <Modal onClose={() => setBookFormCloseRequest((value) => value + 1)}>
          <BookForm
            mode="create"
            listType={listType}
            onClose={() => setActiveModal(null)}
            closeRequestSignal={bookFormCloseRequest}
          />
        </Modal>
      )}

      {activeModal === 'create-shelf' && (
        <Modal onClose={() => setActiveModal(null)}>
          <ShelfForm onClose={() => setActiveModal(null)} />
        </Modal>
      )}

      {activeModal === 'delete' && selectedBook && (
        <Modal onClose={handleCloseModal}>
          <ConfirmDelete
            title={selectedBook.title}
            message="Are you sure you want to delete this book?"
            loading={deleteBookMutation.isPending}
            onCancel={handleCloseModal}
            onConfirm={async () => {
              try {
                await deleteBookMutation.mutateAsync(selectedBook.id);
                handleCloseModal();
                toast.success('Book deleted');
              } catch (error) {
                toast.error(error.message);
              }
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default AppLayout;
