const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const getBooks = async (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      value !== false
    ) {
      params.append(key, String(value));
    }
  });

  const url = params.toString()
    ? `${API_URL}/books?${params.toString()}`
    : `${API_URL}/books`;

  const response = await fetch(url);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch books');
  }

  return result;
};

export const createBook = async (bookData) => {
  const response = await fetch(`${API_URL}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to create book');
  }

  return result.data;
};

export const updateBook = async ({ id, bookData }) => {
  const response = await fetch(`${API_URL}/books/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update book');
  }

  return result.data;
};

export const deleteBook = async (id) => {
  const response = await fetch(`${API_URL}/books/${id}`, {
    method: 'DELETE',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to delete book');
  }

  return result;
};

export const getBook = async (id) => {
  const response = await fetch(`${API_URL}/books/${id}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch book');
  }

  return result.data;
};

export const toggleFavorite = async (id) => {
  const response = await fetch(`${API_URL}/books/${id}/favorite`, {
    method: 'PATCH',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update book');
  }

  return result.data;
};

export const moveToOwned = async (id) => {
  const response = await fetch(`${API_URL}/books/${id}/move-to-owned`, {
    method: 'PATCH',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update book');
  }

  return result.data;
};

export const searchBooks = async (query) => {
  const params = new URLSearchParams({
    q: query,
  });

  const response = await fetch(`${API_URL}/books?${params.toString()}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to search books');
  }

  return result.data;
};
