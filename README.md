# ACT College Library Management System

A simple Server-Side Rendered (SSR) web application for managing a college library.
It lets the librarian manage books, members, and book loans (borrow/return).

This project was built as a group assignment using Node.js, Express, EJS and PostgreSQL.

## Group Members

1. Munira Yesuf    007/BSC-B6/2024 
2. Nebiyat Mesfin  173/BSC-B6/2023 
3. Mikiyas Tsegaye 139/BSC-B6/2023
4. Noha Dengia     035/BSC-B6/2023 
5. Semhal Abebe    010/BSC-B6/2024


## Features

- **Dashboard** showing total books, members, borrowed books, overdue books and total fines
- **Books** – add, view, edit and delete books (full CRUD)
- **Search** – search books by title/author/category, and members by name/email/type
- **Members** – add, view, edit and delete library members (full CRUD)
- **Loans** – borrow a book and return it
  - Borrowing a book automatically reduces the available copies
  - Returning a book adds the copy back
- **Overdue tracking & fines**
  - A separate "Overdue" page lists every late book
  - The fine is calculated as days late × a daily rate (set in `config.js`, default 5 Birr/day)
  - Shows the total fine each student owes
- **EJS partials** (header & footer) reused on every page
- Colorful, friendly user interface
- A custom logger middleware that prints every request to the terminal

## Technologies Used

- **Node.js** – JavaScript runtime
- **Express.js** – web framework / routing
- **EJS** – templating engine (server-side rendering)
- **PostgreSQL** – database
- **pg** – PostgreSQL client for Node.js
- **dotenv** – to load environment variables
- HTML & CSS for the frontend

## Project Structure

```
act-library/
├── app.js              # main server file
├── db.js               # database connection (pg Pool)
├── config.js           # settings (e.g. the daily fine rate)
├── database.sql        # database schema + sample data
├── package.json
├── .env.example        # example environment variables
├── routes/             # all the route files
│   ├── index.js        # dashboard
│   ├── books.js        # books CRUD
│   ├── members.js      # members CRUD
│   └── loans.js        # borrow / return
├── views/              # EJS templates
│   ├── partials/       # reusable header & footer
│   ├── books/
│   ├── members/
│   └── loans/
└── public/css/         # stylesheet
```

## Installation Steps

1. **Clone the repository**
   ```bash
   git clone <your-github-repo-link>
   cd act-library
   ```

2. **Install the dependencies**
   ```bash
   npm install
   ```

3. **Create the database** (in PostgreSQL)
   ```bash
   createdb act_library
   ```
   or inside psql:
   ```sql
   CREATE DATABASE act_library;
   ```

4. **Create the tables and add sample data**
   ```bash
   psql -U postgres -d act_library -f database.sql
   ```

5. **Set up your environment variables**
   - Copy `.env.example` to `.env`
   - Put your own PostgreSQL username, password and database name inside

6. **Start the server**
   ```bash
   npm start
   ```
   (or `npm run dev` if you have nodemon installed)

7. **Open the app** in your browser:
   ```
   http://localhost:3000
   ```

## GitHub Repository

Repository link: `https://github.com/<your-username>/<your-repo-name>`

