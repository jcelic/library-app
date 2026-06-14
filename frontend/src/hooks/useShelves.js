import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createShelf,
  getShelfBooks,
  getShelves,
  addBookToShelf,
  deleteShelf,
  updateShelf,
  removeBookFromShelf,
  getBookShelves,
} from '../api/shelvesApi';

export const useShelves = () => {
  return useQuery({
    queryKey: ['shelves'],
    queryFn: getShelves,
  });
};

export const useCreateShelf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShelf,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['shelves'],
      });
    },
  });
};

export const useShelfBooks = (shelfId, options = {}) => {
  return useQuery({
    queryKey: ['shelf-books', shelfId, options.limit],

    queryFn: () =>
      getShelfBooks(shelfId, {
        limit: options.limit,
      }),

    enabled: !!shelfId,
  });
};

export const useAddBookToShelf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shelfId, bookId }) => addBookToShelf(shelfId, bookId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['shelves'],
      });

      queryClient.invalidateQueries({
        queryKey: ['shelf-books', variables.shelfId],
      });

      queryClient.invalidateQueries({
        queryKey: ['book-shelves', variables.bookId],
      });
    },
  });
};

export const useDeleteShelf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteShelf,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['shelves'],
      });
    },
  });
};

export const useUpdateShelf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateShelf,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['shelves'],
      });
    },
  });
};

export const useRemoveBookFromShelf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shelfId, bookId }) => removeBookFromShelf(shelfId, bookId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['shelves'],
      });

      queryClient.invalidateQueries({
        queryKey: ['shelf-books', variables.shelfId],
      });

      queryClient.invalidateQueries({
        queryKey: ['book-shelves', variables.bookId],
      });
    },
  });
};

export const useBookShelves = (bookId) => {
  return useQuery({
    queryKey: ['book-shelves', bookId],
    queryFn: () => getBookShelves(bookId),
    enabled: !!bookId,
  });
};
