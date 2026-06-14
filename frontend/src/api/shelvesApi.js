const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const getShelves = async () => {
  const response = await fetch(`${API_URL}/shelves`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch shelves');
  }

  return result.data;
};

export const createShelf = async (shelfData) => {
  const response = await fetch(`${API_URL}/shelves`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(shelfData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to create shelf');
  }

  return result.data;
};

export const getShelfBooks = async (shelfId, options = {}) => {
  const params = new URLSearchParams();

  if (options.limit) {
    params.append('limit', options.limit);
  }

  const url = params.toString()
    ? `${API_URL}/shelves/${shelfId}/books?${params.toString()}`
    : `${API_URL}/shelves/${shelfId}/books`;

  const response = await fetch(url);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch shelf books');
  }

  return result.data;
};

export const addBookToShelf = async (shelfId, bookId) => {
  const response = await fetch(
    `${API_URL}/shelves/${shelfId}/books/${bookId}`,
    {
      method: 'POST',
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to add book to shelf');
  }

  return result.data;
};

export const deleteShelf = async (id) => {
  const response = await fetch(`${API_URL}/shelves/${id}`, {
    method: 'DELETE',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to delete shelf');
  }

  return result.data;
};

export const updateShelf = async ({ id, name }) => {
  const response = await fetch(`${API_URL}/shelves/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update shelf');
  }

  return result.data;
};

export const removeBookFromShelf = async (shelfId, bookId) => {
  const response = await fetch(
    `${API_URL}/shelves/${shelfId}/books/${bookId}`,
    {
      method: 'DELETE',
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to remove book from shelf');
  }

  return result.data;
};

export const getBookShelves = async (bookId) => {
  const response = await fetch(`${API_URL}/shelves/books/${bookId}/shelves`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch book shelves');
  }

  return result.data;
};
