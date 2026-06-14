import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout/AppLayout';
import Home from './pages/Home/Home';
import Favorites from './pages/Favorites/Favorites';
import Shelves from './pages/Shelves/Shelves';
import Wishlist from './pages/Wishlist/Wishlist';
import Settings from './pages/Settings/Settings';
import { Toaster } from 'react-hot-toast';
import BookDetails from './pages/BookDetails/BookDetails';
import Shelf from './pages/Shelf/Shelf';
import NotFound from './pages/NotFound/NotFound';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

const App = () => {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--surface-2)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '12px 16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
            backdropFilter: 'blur(6px)',
          },
          success: {
            iconTheme: {
              primary: 'var(--accent)',
              secondary: 'var(--surface-2)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--danger)',
              secondary: 'var(--surface-2)',
            },
          },
        }}
      />
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/shelves" element={<Shelves />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/settings" element={<Settings />} />

            <Route path="/details/:id" element={<BookDetails />} />
            <Route path="/shelves/:id" element={<Shelf />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
