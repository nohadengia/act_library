// ACT College Library Management System
// This is the main file. It starts the server and connects all the routes.

const express = require('express');
const path = require('path');
require('dotenv').config();

// import our route files
const indexRoutes = require('./routes/index');
const bookRoutes = require('./routes/books');
const memberRoutes = require('./routes/members');
const loanRoutes = require('./routes/loans');

const app = express();
const PORT = process.env.PORT || 3000;

// ----- View engine (EJS) -----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ----- Middleware -----
// serve static files like css from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// this lets us read the data that comes from forms (req.body)
app.use(express.urlencoded({ extended: true }));

// a small middleware we wrote to log every request in the terminal
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next(); // move on to the next step
});

// ----- Routes -----
app.use('/', indexRoutes);
app.use('/books', bookRoutes);
app.use('/members', memberRoutes);
app.use('/loans', loanRoutes);

// if no route matched, show a 404 page
app.use((req, res) => {
  res.status(404).render('404', { page: '' });
});

// ----- Start the server -----
app.listen(PORT, () => {
  console.log(`Server is running. Open http://localhost:${PORT} in your browser`);
});
