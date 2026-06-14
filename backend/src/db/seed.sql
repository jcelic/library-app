INSERT INTO users (id, email, name, avatar_url)
VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'demo@example.com',
  'Demo User',
  NULL
);

INSERT INTO user_books (
  id,
  user_id,
  title,
  subtitle,
  author,
  category,
  image_source_url,
  image_url,
  status,
  list_type,
  is_favorite
)
VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  'Manufacturing Consent',
  NULL,
  'Noam Chomsky and Edward S. Herman',
  'nonfiction',
  'https://m.media-amazon.com/images/I/71s-Pj07YUL._AC_UF1000,1000_QL80_.jpg',
  'https://m.media-amazon.com/images/I/71s-Pj07YUL._AC_UF1000,1000_QL80_.jpg',
  'finished',
  'owned',
  true
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '11111111-1111-1111-1111-111111111111',
  '1984',
  NULL,
  'George Orwell',
  'fiction',
  'https://images.squarespace-cdn.com/content/v1/56cde58af699bb2bd4ea993a/1492583180601-80AB3XLX180SGNSSWVP4/image-asset.png',
  'https://images.squarespace-cdn.com/content/v1/56cde58af699bb2bd4ea993a/1492583180601-80AB3XLX180SGNSSWVP4/image-asset.png',
  'finished',
  'owned',
  true
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '11111111-1111-1111-1111-111111111111',
  'Crime and Punishment',
  NULL,
  'Fyodor Dostoevsky',
  'fiction',
  'https://images-eu.bookshop.org/images/9781840228564.jpg?v=enc-v1',
  'https://images-eu.bookshop.org/images/9781840228564.jpg?v=enc-v1',
  'finished',
  'owned',
  true
),
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  '11111111-1111-1111-1111-111111111111',
  'The Stranger',
  NULL,
  'Albert Camus',
  'fiction',
  'https://prod-bb-images.akamaized.net/book-covers/coverimage-9781998114375-demarque-2023-08-17t03-10.jpg?w=640',
  'https://prod-bb-images.akamaized.net/book-covers/coverimage-9781998114375-demarque-2023-08-17t03-10.jpg?w=640',
  'not_finished',
  'wishlist',
  false
),
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  '11111111-1111-1111-1111-111111111111',
  'Meditations',
  NULL,
  'Marcus Aurelius',
  'nonfiction',
  'https://www.peterpauper.com/cdn/shop/products/9781441337382_1080x.jpg?v=1636331722',
  'https://www.peterpauper.com/cdn/shop/products/9781441337382_1080x.jpg?v=1636331722',
  'finished',
  'owned',
  true
),
(
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  '11111111-1111-1111-1111-111111111111',
  'Sapiens',
  NULL,
  'Yuval Noah Harari',
  'nonfiction',
  'https://m.media-amazon.com/images/I/713jIoMO3UL.jpg',
  'https://m.media-amazon.com/images/I/713jIoMO3UL.jpg',
  'not_finished',
  'owned',
  false
),
(
  '12121212-1212-1212-1212-121212121212',
  '11111111-1111-1111-1111-111111111111',
  'Atomic Habits',
  NULL,
  'James Clear',
  'nonfiction',
  'https://m.media-amazon.com/images/I/81kg51XRc1L._AC_UF1000,1000_QL80_.jpg',
  'https://m.media-amazon.com/images/I/81kg51XRc1L._AC_UF1000,1000_QL80_.jpg',
  'not_finished',
  'wishlist',
  false
),
(
  '13131313-1313-1313-1313-131313131313',
  '11111111-1111-1111-1111-111111111111',
  'Permanent Record',
  NULL,
  'Edward Snowden',
  'nonfiction',
  'https://m.media-amazon.com/images/I/91GgFOOnD+L._AC_UF1000,1000_QL80_.jpg',
  'https://m.media-amazon.com/images/I/91GgFOOnD+L._AC_UF1000,1000_QL80_.jpg',
  'not_finished',
  'wishlist',
  false
);

INSERT INTO shelves (id, user_id, name)
VALUES
(
  '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  'Classics'
),
(
  '55555555-5555-5555-5555-555555555555',
  '11111111-1111-1111-1111-111111111111',
  'Nonfiction'
);

INSERT INTO shelf_books (shelf_id, user_book_id)
VALUES
(
  '44444444-4444-4444-4444-444444444444',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
),
(
  '44444444-4444-4444-4444-444444444444',
  'cccccccc-cccc-cccc-cccc-cccccccccccc'
),
(
  '44444444-4444-4444-4444-444444444444',
  'dddddddd-dddd-dddd-dddd-dddddddddddd'
),
(
  '55555555-5555-5555-5555-555555555555',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
),
(
  '55555555-5555-5555-5555-555555555555',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'
),
(
  '55555555-5555-5555-5555-555555555555',
  'ffffffff-ffff-ffff-ffff-ffffffffffff'
),
(
  '55555555-5555-5555-5555-555555555555',
  '12121212-1212-1212-1212-121212121212'
),
(
  '55555555-5555-5555-5555-555555555555',
  '13131313-1313-1313-1313-131313131313'
);