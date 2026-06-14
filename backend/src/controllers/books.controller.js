import { pool } from '../db/pool.js';
import {
  createBookSchema,
  updateBookSchema,
} from '../validators/books.validator.js';

const DEMO_USER_ID = process.env.DEMO_USER_ID;

export const getBooks = async (req, res) => {
  try {
    const { favorite, list_type, status, q, sort } = req.query;

    const baseConditions = ['user_id = $1'];
    const baseValues = [DEMO_USER_ID];

    if (list_type) {
      baseConditions.push(`list_type = $${baseValues.length + 1}`);
      baseValues.push(list_type);
    }

    const totalCountResult = await pool.query(
      `
      SELECT COUNT(*)::int AS total_count
      FROM user_books
      WHERE ${baseConditions.join(' AND ')}
      `,
      baseValues,
    );

    const conditions = [...baseConditions];
    const values = [...baseValues];

    if (favorite === 'true') {
      conditions.push(`is_favorite = $${values.length + 1}`);
      values.push(true);
    }

    if (status) {
      conditions.push(`status = $${values.length + 1}`);
      values.push(status);
    }

    if (q) {
      conditions.push(`
        (
          title ILIKE $${values.length + 1}
          OR author ILIKE $${values.length + 1}
        )
      `);
      values.push(`%${q}%`);
    }

    const exactTitleParam = values.length + 1;
    const startsWithParam = values.length + 2;

    const sortMap = {
      created_asc: 'created_at ASC',
      created_desc: 'created_at DESC',
      updated_desc: 'updated_at DESC',
      title_asc: 'lower(title) ASC',
      title_desc: 'lower(title) DESC',
      author_asc: 'lower(author) ASC',
      author_desc: 'lower(author) DESC',
    };

    const orderBy = sortMap[sort] || sortMap.created_asc;

    const result = await pool.query(
      `
      SELECT *
      FROM user_books
      WHERE ${conditions.join(' AND ')}
      ORDER BY
        CASE
          WHEN lower(title) = lower($${exactTitleParam}) THEN 0
          WHEN title ILIKE $${startsWithParam} THEN 1
          WHEN author ILIKE $${startsWithParam} THEN 2
          ELSE 3
        END,
        ${orderBy}
      `,
      [...values, q || '', `${q || ''}%`],
    );

    res.json({
      data: result.rows,
      totalCount: totalCountResult.rows[0].total_count,
      filteredCount: result.rows.length,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to fetch books',
    });
  }
};

export const createBook = async (req, res) => {
  try {
    const validatedData = createBookSchema.parse(req.body);

    const {
      title,
      subtitle,
      author,
      category,
      image_source_url,
      status,
      list_type,
      is_favorite,
    } = validatedData;

    const existingBookResult = await pool.query(
      `
      SELECT id
      FROM user_books
      WHERE user_id = $1
      AND lower(title) = lower($2)
      AND lower(author) = lower($3)
      LIMIT 1
      `,
      [DEMO_USER_ID, title, author],
    );

    if (existingBookResult.rows.length > 0) {
      return res.status(409).json({
        message: 'Book already exists in your library',
      });
    }

    const result = await pool.query(
      `
      INSERT INTO user_books (
        user_id,
        title,
        subtitle,
        author,
        category,
        image_source_url,
        status,
        list_type,
        is_favorite
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
      `,
      [
        DEMO_USER_ID,
        title,
        subtitle,
        author,
        category,
        image_source_url,
        status,
        list_type,
        is_favorite,
      ],
    );

    res.status(201).json({
      data: result.rows[0],
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Invalid book data',
        errors: error.issues,
      });
    }

    console.error(error);

    res.status(500).json({
      message: 'Failed to create book',
    });
  }
};

export const updateBook = async (req, res) => {
  try {
    const validatedData = updateBookSchema.parse(req.body);
    const { id } = req.params;

    const {
      title,
      subtitle,
      author,
      category,
      image_source_url,
      status,
      list_type,
      is_favorite,
    } = validatedData;

    const existingBookResult = await pool.query(
      `
      SELECT id
      FROM user_books
      WHERE user_id = $1
      AND lower(title) = lower($2)
      AND lower(author) = lower($3)
      AND id != $4
      LIMIT 1
      `,
      [DEMO_USER_ID, title, author, id],
    );

    if (existingBookResult.rows.length > 0) {
      return res.status(409).json({
        message: 'Book already exists in your library',
      });
    }

    const result = await pool.query(
      `
      UPDATE user_books
      SET
        title = $1,
        subtitle = $2,
        author = $3,
        category = $4,
        image_source_url = $5,
        status = $6,
        list_type = $7,
        is_favorite = $8,
        updated_at = now()
      WHERE id = $9
      AND user_id = $10
      RETURNING *
      `,
      [
        title,
        subtitle,
        author,
        category,
        image_source_url,
        status,
        list_type,
        is_favorite,
        id,
        DEMO_USER_ID,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Book not found',
      });
    }

    res.json({
      data: result.rows[0],
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Invalid book data',
        errors: error.issues,
      });
    }

    console.error(error);

    res.status(500).json({
      message: 'Failed to update book',
    });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM user_books
      WHERE id = $1
      AND user_id = $2
      RETURNING *
      `,
      [id, DEMO_USER_ID],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Book not found',
      });
    }

    res.status(200).json({
      message: 'Book deleted successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to delete book',
    });
  }
};

export const getBook = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM user_books
      WHERE id = $1
      AND user_id = $2
      `,
      [id, DEMO_USER_ID],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Book not found',
      });
    }

    res.json({
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to fetch book',
    });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE user_books
      SET is_favorite = NOT is_favorite,
          updated_at = now()
      WHERE id = $1
      AND user_id = $2
      RETURNING *
      `,
      [id, DEMO_USER_ID],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Book not found',
      });
    }

    res.json({
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to update book',
    });
  }
};

export const moveToOwned = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE user_books
      SET list_type = 'owned',
          updated_at = now()
      WHERE id = $1
      AND user_id = $2
      RETURNING *
      `,
      [id, DEMO_USER_ID],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Book not found',
      });
    }

    res.json({
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to update book',
    });
  }
};
