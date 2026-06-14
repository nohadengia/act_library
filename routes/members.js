// Routes for Members (the people who borrow books)

const express = require('express');
const router = express.Router();
const pool = require('../db');

// READ - list all members (and handle search)
router.get('/', async (req, res) => {
  try {
    const search = req.query.search;
    let result;

    if (search && search.trim() !== '') {
      result = await pool.query(
        `SELECT * FROM members
         WHERE full_name ILIKE $1 OR email ILIKE $1 OR member_type ILIKE $1
         ORDER BY id ASC`,
        ['%' + search + '%']
      );
    } else {
      result = await pool.query('SELECT * FROM members ORDER BY id ASC');
    }

    res.render('members/list', { page: 'members', members: result.rows, search: search || '' });
  } catch (err) {
    console.log(err);
    res.send('Error getting the members.');
  }
});

// show the add member form
router.get('/add', (req, res) => {
  res.render('members/add', { page: 'members' });
});

// CREATE - add a new member
router.post('/add', async (req, res) => {
  try {
    const { full_name, email, phone, member_type } = req.body;
    await pool.query(
      'INSERT INTO members (full_name, email, phone, member_type) VALUES ($1, $2, $3, $4)',
      [full_name, email, phone, member_type]
    );
    res.redirect('/members');
  } catch (err) {
    console.log(err);
    res.send('Error adding the member.');
  }
});

// show the edit form
router.get('/edit/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM members WHERE id = $1', [req.params.id]);
    res.render('members/edit', { page: 'members', member: result.rows[0] });
  } catch (err) {
    console.log(err);
    res.send('Error loading the member.');
  }
});

// UPDATE - save changes
router.post('/edit/:id', async (req, res) => {
  try {
    const { full_name, email, phone, member_type } = req.body;
    await pool.query(
      'UPDATE members SET full_name = $1, email = $2, phone = $3, member_type = $4 WHERE id = $5',
      [full_name, email, phone, member_type, req.params.id]
    );
    res.redirect('/members');
  } catch (err) {
    console.log(err);
    res.send('Error updating the member.');
  }
});

// DELETE - remove a member
router.post('/delete/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM members WHERE id = $1', [req.params.id]);
    res.redirect('/members');
  } catch (err) {
    console.log(err);
    res.send('Error deleting the member.');
  }
});

module.exports = router;
