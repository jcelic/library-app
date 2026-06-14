# Personal Library App

![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-backend-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-database-blue)
![Status](https://img.shields.io/badge/status-active-success)

A full-stack personal library application for managing owned books, wishlist books, favorites, and custom shelves.

Built as a portfolio project with a focus on reusable components, clean architecture, form validation, API integration, PostgreSQL database design, and responsive user experience.

---

## Live Demo

[Live Demo](https://library-app-jc.vercel.app)

---

## Features

### Book Management

- Add books
- Edit books
- Delete books
- View detailed book information
- Navigate between books from the details page
- Mark and unmark favorite books
- Move books from wishlist to owned books
- Mark books as finished or unfinished

### Collections

- Owned Books
- Favorites
- Wishlist
- Custom Shelves

### Search and Filters

- Search books by title or author
- Sort books by created date, updated date, title, or author
- Filter books by favorite status
- Filter books by reading status

### Shelf Management

- Create shelves
- Rename shelves
- Delete shelves
- Add books to shelves
- Remove books from shelves
- View shelf contents

### User Experience

- Responsive design
- Desktop sidebar navigation
- Mobile bottom navigation
- Loading skeletons
- Error states
- Empty states
- Toast notifications
- Confirmation modal for deleting books
- Form validation with Zod
- Dark and light theme toggle

---

## Screenshots

### Home

![Home](./screenshots/home.png)

### Book Details

![Book Details](./screenshots/book-details.png)

### Shelves

![Shelves](./screenshots/shelves.png)

### Add Book

![Add Book](./screenshots/add-book.png)

### Mobile Home

![Mobile Home](./screenshots/mobile-home.png)

---

## Tech Stack

### Frontend

- React 19
- React Router
- TanStack Query
- React Hook Form
- Zod
- CSS Modules
- React Hot Toast

### Backend

- Node.js
- Express

### Database

- PostgreSQL
- Neon

---

## Current Status

Authentication has not yet been implemented.

The application currently uses a demo user configuration for development purposes. Full user registration, login, and protected user-specific sessions are planned as a future improvement.

Some settings page actions, such as profile editing, avatar upload, data export, and account deletion, are currently UI-only and not connected to backend functionality yet.

---

## Project Structure

```text
library-app
│
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── db
│   │   │   ├── pool.js
│   │   │   ├── schema.sql
│   │   │   └── seed.sql
│   │   ├── routes
│   │   ├── validators
│   │   └── server.js
│   │
│   ├── .env.example
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── hooks
│   │   ├── layouts
│   │   ├── pages
│   │   └── validation
│   │
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
│
├── screenshots
│   ├── home.png
│   ├── book-details.png
│   ├── shelves.png
│   ├── add-book.png
│   └── mobile-home.png
│
└── README.md
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/jcelic/library-app.git
cd library-app
```

Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

---

## Environment Variables

### Backend

Create `backend/.env`

```env
PORT=3001
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
DEMO_USER_ID=11111111-1111-1111-1111-111111111111
```

### Frontend

Create `frontend/.env`

```env
VITE_API_URL=http://localhost:3001/api
```

---

## Database Setup

The project includes a complete database schema and demo seed data.

Create a PostgreSQL database and run:

```bash
psql -d your_database -f backend/src/db/schema.sql
psql -d your_database -f backend/src/db/seed.sql
```

The seed file creates:

- A demo user
- Sample books
- Sample shelves
- Shelf/book relationships

---

## Run Locally

### Backend

```bash
cd backend
npm run dev
```

Backend runs on:

```text
http://localhost:3001
```

### Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Future Improvements

### Authentication

- User registration
- Login and logout
- Protected routes
- Replace demo user setup with authenticated user

### Settings

- Connect profile form to backend
- Avatar upload
- Export library data
- Delete account functionality

---

## Purpose

This project was built to practice developing a realistic full-stack application using React, Express, PostgreSQL, TanStack Query, and Zod while following a modular and scalable architecture.

The focus was on building a maintainable codebase, reusable UI components, REST API design, database relationships, form validation, and a responsive user experience similar to a real-world application.
