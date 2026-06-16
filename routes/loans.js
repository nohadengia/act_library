// Routes for Loans (borrowing and returning books)

const express = require('express');
const router = express.Router();
const pool = require('../db');
const { FINE_PER_DAY } = require('../config');

// READ - show all loan records
router.get('/', async (req, res) => {
  try {
    // we join with books and members so we can show their names instead of just ids.
    // the CASE part works out how many days a borrowed book is late (0 if not late).
    const result = await pool.query(`
      SELECT loans.*, books.title AS book_title, members.full_name AS member_name,
             CASE WHEN loans.status = 'Borrowed' AND loans.due_date < CURRENT_DATE
                  THEN (CURRENT_DATE - loans.due_date)
                  ELSE 0 END AS days_late
      FROM loans
      JOIN books ON loans.book_id = books.id
      JOIN members ON loans.member_id = members.id
      ORDER BY loans.id DESC
    `);

    // work out the fine for each loan (days late x daily fine)
    const loans = result.rows.map(function (loan) {
      loan.fine = loan.days_late * FINE_PER_DAY;
      return loan;
    });

    res.render('loans/list', { page: 'loans', loans: loans });
  } catch (err) {
    console.log(err);
    res.send('Error loading the loans.');
  }
});

// READ - show overdue books and the fine each student owes
router.get('/overdue', async (req, res) => {
  try {
    // get every borrowed book whose due date has already passed.
    // (CURRENT_DATE - due_date) gives the number of days it is late.
    const result = await pool.query(`
      SELECT loans.id, books.title AS book_title,
             members.id AS member_id, members.full_name AS member_name,
             loans.due_date, (CURRENT_DATE - loans.due_date) AS days_late
      FROM loans
      JOIN books ON loans.book_id = books.id
      JOIN members ON loans.member_id = members.id
      WHERE loans.status = 'Borrowed' AND loans.due_date < CURRENT_DATE
      ORDER BY days_late DESC
    `);

    // add a fine to each overdue book
    const overdue = result.rows.map(function (row) {
      row.fine = row.days_late * FINE_PER_DAY;
      return row;
    });

    // add up the fines per student so we can show a "who owes what" summary
    const studentTotals = {};
    overdue.forEach(function (item) {
      if (!studentTotals[item.member_id]) {
        studentTotals[item.member_id] = { name: item.member_name, books: 0, totalFine: 0 };
      }
      studentTotals[item.member_id].books += 1;
      studentTotals[item.member_id].totalFine += item.fine;
    });
    const summary = Object.values(studentTotals);

    res.render('loans/overdue', {
      page: 'overdue',
      overdue: overdue,
      summary: summary,
      finePerDay: FINE_PER_DAY,
    });
  } catch (err) {
    console.log(err);
    res.send('Error loading the overdue list.');
  }
});

// show the borrow form
router.get('/add', async (req, res) => {
  try {
    const books = await pool.query('SELECT * FROM books WHERE available_copies > 0 ORDER BY title');
    const members = await pool.query('SELECT * FROM members ORDER BY full_name');
    res.render('loans/add', { page: 'loans', books: books.rows, members: members.rows });
  } catch (err) {
    console.log(err);
    res.send('Error loading the borrow form.');
  }
});

// CREATE - borrow a book (this also reduces the available copies)
router.post('/add', async (req, res) => {
  try {
    const { book_id, member_id, due_date } = req.body;

    // 1. add the loan record
    await pool.query(
      "INSERT INTO loans (book_id, member_id, due_date, status) VALUES ($1, $2, $3, 'Borrowed')",
      [book_id, member_id, due_date]
    );

    // 2. take one copy away from the available count
    await pool.query(
      'UPDATE books SET available_copies = available_copies - 1 WHERE id = $1',
      [book_id]
    );

    res.redirect('/loans');
  } catch (err) {
    console.log(err);
    res.send('Error borrowing the book.');
  }
});

// UPDATE - return a book (this gives the copy back)
router.post('/return/:id', async (req, res) => {
  try {
    // first find the loan so we know which book to update
    const loan = await pool.query('SELECT * FROM loans WHERE id = $1', [req.params.id]);
    const bookId = loan.rows[0].book_id;

    // 1. mark the loan as returned
    await pool.query(
      "UPDATE loans SET status = 'Returned', return_date = CURRENT_DATE WHERE id = $1",
      [req.params.id]
    );

    // 2. add the copy back to the available count
    await pool.query(
      'UPDATE books SET available_copies = available_copies + 1 WHERE id = $1',
      [bookId]
    );

    res.redirect('/loans');
  } catch (err) {
    console.log(err);
    res.send('Error returning the book.');
  }
});

module.exports = router;
