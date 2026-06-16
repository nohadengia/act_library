// Routes for Books (this file has all the CRUD operations for books)

const express = require('express');
const router = express.Router();
const pool = require('../db');

// READ - show the list of all books (and handle search)
router.get('/', async (req, res) => {
  try {
    const search = req.query.search; // comes from the ?search=... in the url
    let result;

    if (search && search.trim() !== '') {
      // search by title, author or category. ILIKE means case-insensitive.
      // the % signs let it match anywhere in the word.
      result = await pool.query(
        `SELECT * FROM books
         WHERE title ILIKE $1 OR author ILIKE $1 OR category ILIKE $1
         ORDER BY id ASC`,
        ['%' + search + '%']
      );
    } else {
      result = await pool.query('SELECT * FROM books ORDER BY id ASC');
    }

    res.render('books/list', { page: 'books', books: result.rows, search: search || '' });
  } catch (err) {
    console.log(err);
    res.send('Error getting the books.');
  }
});

// show the form to add a new book
router.get('/add', (req, res) => {
  res.render('books/add', { page: 'books' });
});

// CREATE - save the new book to the database
router.post('/add', async (req, res) => {
  try {
    const { title, author, isbn, category, total_copies } = req.body;
    // when a book is first added, available copies = total copies
    await pool.query(
      `INSERT INTO books (title, author, isbn, category, total_copies, available_copies)
       VALUES ($1, $2, $3, $4, $5, $5)`,
      [title, author, isbn, category, total_copies]
    );
    res.redirect('/books');
  } catch (err) {
    console.log(err);
    res.send('Error adding the book.');
  }
});

// show the edit form for one book
router.get('/edit/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [req.params.id]);
    res.render('books/edit', { page: 'books', book: result.rows[0] });
  } catch (err) {
    console.log(err);
    res.send('Error loading the book.');
  }
});

// UPDATE - save the changes
router.post('/edit/:id', async (req, res) => {
  try {
    const { title, author, isbn, category, total_copies, available_copies } = req.body;
    await pool.query(
      `UPDATE books
       SET title = $1, author = $2, isbn = $3, category = $4, total_copies = $5, available_copies = $6
       WHERE id = $7`,
      [title, author, isbn, category, total_copies, available_copies, req.params.id]
    );
    res.redirect('/books');
  } catch (err) {
    console.log(err);
    res.send('Error updating the book.');
  }
});

// DELETE - remove the book
router.post('/delete/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM books WHERE id = $1', [req.params.id]);
    res.redirect('/books');
  } catch (err) {
    console.log(err);
    res.send('Error deleting the book.');
  }
});

module.exports = router;
