import express from 'express';
import {
  createShelf,
  getShelfBooks,
  getShelves,
  addBookToShelf,
  deleteShelf,
  updateShelf,
  removeBookFromShelf,
  getBookShelves,
} from '../controllers/shelves.controller.js';

const router = express.Router();

router.get('/books/:bookId/shelves', getBookShelves);
router.get('/:id/books', getShelfBooks);
router.get('/', getShelves);
router.post('/:shelfId/books/:bookId', addBookToShelf);
router.post('/', createShelf);
router.delete('/:shelfId/books/:bookId', removeBookFromShelf);
router.delete('/:id', deleteShelf);
router.patch('/:id', updateShelf);

export default router;
