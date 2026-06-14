CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  author TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('fiction', 'nonfiction')),
  image_source_url TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'not_finished' CHECK (status IN ('finished', 'not_finished')),
  list_type TEXT NOT NULL DEFAULT 'owned' CHECK (list_type IN ('owned', 'wishlist')),
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT user_books_user_id_title_author_key UNIQUE (user_id, title, author)
);

CREATE TABLE shelves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT shelves_user_id_name_key UNIQUE (user_id, name)
);

CREATE TABLE shelf_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shelf_id UUID NOT NULL REFERENCES shelves(id) ON DELETE CASCADE,
  user_book_id UUID NOT NULL REFERENCES user_books(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT shelf_books_shelf_id_user_book_id_key UNIQUE (shelf_id, user_book_id)
);