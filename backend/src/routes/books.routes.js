import express from 'express';
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  getBook,
  toggleFavorite,
  moveToOwned,
} from '../controllers/books.controller.js';

const router = express.Router();

router.get('/', getBooks);
router.post('/', createBook);
router.patch('/:id/favorite', toggleFavorite);
router.patch('/:id', updateBook);
router.delete('/:id', deleteBook);
router.get('/:id', getBook);
router.patch('/:id/move-to-owned', moveToOwned);

export default router;
