// Routes for the home / dashboard page

const express = require('express');
const router = express.Router();
const pool = require('../db');
const { FINE_PER_DAY } = require('../config');

// GET / -> the dashboard
router.get('/', async (req, res) => {
  try {
    // get some quick counts to show on the dashboard cards
    const books = await pool.query('SELECT COUNT(*) FROM books');
    const members = await pool.query('SELECT COUNT(*) FROM members');
    const borrowed = await pool.query("SELECT COUNT(*) FROM loans WHERE status = 'Borrowed'");

    // how many books are overdue, and total fines owed so far
    const overdue = await pool.query(
      "SELECT COUNT(*) FROM loans WHERE status = 'Borrowed' AND due_date < CURRENT_DATE"
    );
    const fineDays = await pool.query(
      "SELECT COALESCE(SUM(CURRENT_DATE - due_date), 0) AS days FROM loans WHERE status = 'Borrowed' AND due_date < CURRENT_DATE"
    );
    const totalFines = Number(fineDays.rows[0].days) * FINE_PER_DAY;

    res.render('index', {
      page: 'home',
      totalBooks: books.rows[0].count,
      totalMembers: members.rows[0].count,
      borrowedBooks: borrowed.rows[0].count,
      overdueBooks: overdue.rows[0].count,
      totalFines: totalFines,
    });
  } catch (err) {
    console.log(err);
    res.send('Something went wrong while loading the dashboard.');
  }
});

module.exports = router;
