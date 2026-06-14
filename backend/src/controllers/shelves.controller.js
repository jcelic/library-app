import { pool } from '../db/pool.js';
import { shelfSchema } from '../validators/shelves.validator.js';

const DEMO_USER_ID = process.env.DEMO_USER_ID;

export const createShelf = async (req, res) => {
  try {
    const validatedData = shelfSchema.parse(req.body);

    const result = await pool.query(
      `
      INSERT INTO shelves (user_id, name)
      VALUES ($1, $2)
      RETURNING *
      `,
      [DEMO_USER_ID, validatedData.name],
    );

    res.status(201).json({
      message: 'Shelf created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Invalid shelf data',
        errors: error.issues,
      });
    }

    if (error.code === '23505') {
      return res.status(409).json({
        message: 'Shelf with this name already exists',
      });
    }

    console.error(error);

    res.status(500).json({
      message: 'Failed to create shelf',
    });
  }
};

export const getShelves = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        s.*,
        COUNT(sb.user_book_id)::int AS book_count
      FROM shelves s
      LEFT JOIN shelf_books sb
        ON sb.shelf_id = s.id
      WHERE s.user_id = $1
      GROUP BY s.id
      ORDER BY s.created_at ASC
      `,
      [DEMO_USER_ID],
    );

    res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to fetch shelves',
    });
  }
};

export const getShelfBooks = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit } = req.query;

    const values = [id, DEMO_USER_ID];
    let limitClause = '';

    if (limit !== undefined) {
      const parsedLimit = Number(limit);

      if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
        return res.status(400).json({
          message: 'Invalid limit query parameter',
        });
      }

      values.push(parsedLimit);
      limitClause = `LIMIT $${values.length}`;
    }

    const result = await pool.query(
      `
      SELECT ub.*
      FROM shelf_books sb
      JOIN user_books ub
        ON ub.id = sb.user_book_id
      JOIN shelves s
        ON s.id = sb.shelf_id
      WHERE sb.shelf_id = $1
      AND s.user_id = $2
      AND ub.user_id = $2
      ORDER BY sb.added_at ASC
      ${limitClause}
      `,
      values,
    );

    res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to fetch shelf books',
    });
  }
};

export const addBookToShelf = async (req, res) => {
  try {
    const { shelfId, bookId } = req.params;

    const shelfResult = await pool.query(
      `
      SELECT id
      FROM shelves
      WHERE id = $1
      AND user_id = $2
      `,
      [shelfId, DEMO_USER_ID],
    );

    if (shelfResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Shelf not found',
      });
    }

    const bookResult = await pool.query(
      `
      SELECT id
      FROM user_books
      WHERE id = $1
      AND user_id = $2
      `,
      [bookId, DEMO_USER_ID],
    );

    if (bookResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Book not found',
      });
    }

    const result = await pool.query(
      `
      INSERT INTO shelf_books (shelf_id, user_book_id)
      VALUES ($1, $2)
      ON CONFLICT (shelf_id, user_book_id) DO NOTHING
      RETURNING *
      `,
      [shelfId, bookId],
    );

    res.status(201).json({
      message: 'Book added to shelf',
      data: result.rows[0] || null,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to add book to shelf',
    });
  }
};

export const deleteShelf = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM shelves
      WHERE id = $1
      AND user_id = $2
      RETURNING *
      `,
      [id, DEMO_USER_ID],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Shelf not found',
      });
    }

    res.status(200).json({
      message: 'Shelf deleted successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to delete shelf',
    });
  }
};

export const updateShelf = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = shelfSchema.parse(req.body);

    const result = await pool.query(
      `
      UPDATE shelves
      SET name = $1,
          updated_at = NOW()
      WHERE id = $2
      AND user_id = $3
      RETURNING *
      `,
      [validatedData.name, id, DEMO_USER_ID],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Shelf not found',
      });
    }

    res.status(200).json({
      message: 'Shelf updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Invalid shelf data',
        errors: error.issues,
      });
    }

    if (error.code === '23505') {
      return res.status(409).json({
        message: 'Shelf with this name already exists',
      });
    }

    console.error(error);

    res.status(500).json({
      message: 'Failed to update shelf',
    });
  }
};

export const removeBookFromShelf = async (req, res) => {
  try {
    const { shelfId, bookId } = req.params;

    const result = await pool.query(
      `
      DELETE FROM shelf_books sb
      USING shelves s, user_books ub
      WHERE sb.shelf_id = s.id
      AND sb.user_book_id = ub.id
      AND sb.shelf_id = $1
      AND sb.user_book_id = $2
      AND s.user_id = $3
      AND ub.user_id = $3
      RETURNING sb.*
      `,
      [shelfId, bookId, DEMO_USER_ID],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Book is not on this shelf',
      });
    }

    res.status(200).json({
      message: 'Book removed from shelf',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to remove book from shelf',
    });
  }
};

export const getBookShelves = async (req, res) => {
  try {
    const { bookId } = req.params;

    const result = await pool.query(
      `
      SELECT s.*
      FROM shelves s
      JOIN shelf_books sb
        ON sb.shelf_id = s.id
      JOIN user_books ub
        ON ub.id = sb.user_book_id
      WHERE sb.user_book_id = $1
      AND s.user_id = $2
      AND ub.user_id = $2
      ORDER BY s.created_at DESC
      `,
      [bookId, DEMO_USER_ID],
    );

    res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to fetch book shelves',
    });
  }
};
