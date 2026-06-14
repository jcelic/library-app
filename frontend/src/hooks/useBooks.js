import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  getBook,
  toggleFavorite,
  moveToOwned,
  searchBooks,
} from '../api/booksApi';

export const useBooks = (filters = {}) => {
  return useQuery({
    queryKey: ['books', filters],
    queryFn: () => getBooks(filters),
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBook,
    onSuccess: (updatedBook) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', updatedBook.id] });
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.removeQueries({ queryKey: ['book', id] });
      queryClient.invalidateQueries({ queryKey: ['shelves'] });
      queryClient.invalidateQueries({ queryKey: ['shelf-books'] });
    },
  });
};

export const useBook = (id) => {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => getBook(id),
    enabled: !!id,
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFavorite,
    onSuccess: (updatedBook) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', updatedBook.id] });
    },
  });
};

export const useMoveToOwned = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: moveToOwned,
    onSuccess: (updatedBook) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', updatedBook.id] });
    },
  });
};

export const useSearchBooks = (query) => {
  return useQuery({
    queryKey: ['book-search', query],
    queryFn: () => searchBooks(query),
    enabled: query.trim().length >= 2,
  });
};
