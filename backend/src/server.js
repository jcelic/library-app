import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import booksRoutes from './routes/books.routes.js';
import shelvesRoutes from './routes/shelves.routes.js';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing in .env');
}

if (!process.env.DEMO_USER_ID) {
  throw new Error('DEMO_USER_ID is missing in .env');
}

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/books', booksRoutes);
app.use('/api/shelves', shelvesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
