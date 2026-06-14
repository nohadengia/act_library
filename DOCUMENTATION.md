# Project Documentation / Report

**Project Title:** ACT College Library Management System
**Course:** Node.js + Express + EJS Mini Application
**Submission Date:** June 15, 2026

---

## 1. Introduction

For this group project we decided to build a Library Management System for a
college. We chose this idea because a library is something we all understand,
and it gives us a clear reason to use Create, Read, Update and Delete (CRUD)
operations on more than one type of data (books, members and loans).

The application is server-side rendered, which means the HTML pages are built
on the server using EJS and then sent to the browser. This is different from
using a separate frontend framework like React.

## 2. Objectives

- Practice building a backend with Express.js
- Use EJS to render dynamic pages
- Store and manage data in a PostgreSQL database
- Learn how to reuse code using EJS partials
- Work together as a group using GitHub

## 3. System Overview

The system has three main parts that the user can manage:

1. **Books** – the books in the library.
2. **Members** – the students/teachers who can borrow books.
3. **Loans** – the record of which member borrowed which book.

There is also a **Dashboard** that shows quick statistics.

## 4. How It Works

### Books
The librarian can add a new book with a title, author, ISBN, category and
number of copies. Books can be edited or deleted. The list page shows how many
copies are still available. There is also a search box that finds books by
title, author or category using SQL `ILIKE` (case-insensitive matching).

### Members
1. Munira Yesuf    007/BSC-B6/2024 
2. Nebiyat Mesfin  173/BSC-B6/2023 
3. Mikiyas Tsegaye 139/BSC-B6/2023
4. Noha Dengia     035/BSC-B6/2023 
5. Semhal Abebe    010/BSC-B6/2024 


### Loans (Borrow & Return)
When a member borrows a book:
- A new loan record is created with the status "Borrowed".
- The available copies of that book go down by one.

When the book is returned:
- The loan status changes to "Returned" and the return date is saved.
- The available copies go back up by one.

We only allow books that still have available copies to be borrowed.

### Overdue Books & Fines
A book is "overdue" if it is still borrowed and its due date has already passed.
We work out how many days late it is with `CURRENT_DATE - due_date`, then the
fine is `days late × fine rate`. The fine rate lives in `config.js` (default is
5 Birr per day) so it is easy to change in one place.

The Overdue page shows two things:
1. A summary of how much each student owes in total.
2. A full list of every overdue book with its fine.

## 5. Database Design

We used three tables:

**books**
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | primary key |
| title | VARCHAR | required |
| author | VARCHAR | required |
| isbn | VARCHAR | |
| category | VARCHAR | |
| total_copies | INTEGER | |
| available_copies | INTEGER | |
| created_at | TIMESTAMP | |

**members**
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | primary key |
| full_name | VARCHAR | required |
| email | VARCHAR | |
| phone | VARCHAR | |
| member_type | VARCHAR | Student/Teacher/Staff |
| created_at | TIMESTAMP | |

**loans**
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | primary key |
| book_id | INTEGER | foreign key -> books |
| member_id | INTEGER | foreign key -> members |
| borrow_date | DATE | |
| due_date | DATE | |
| return_date | DATE | |
| status | VARCHAR | Borrowed / Returned |

The `loans` table connects to `books` and `members` using foreign keys, so we
can join them and show names instead of just numbers.

## 6. Technical Concepts Demonstrated

- **Express server setup** – in `app.js`.
- **Routing** – we used `express.Router()` and split routes into separate files
  inside the `routes/` folder.
- **Middleware** – `express.static`, `express.urlencoded`, and a custom logger
  middleware we wrote ourselves.
- **CRUD operations** – done on books and members, plus borrow/return for loans.
- **Form handling** – HTML forms send data with POST and we read it from `req.body`.
- **EJS dynamic rendering** – data from the database is looped over and shown in tables.
- **EJS partials (research component)** – `header.ejs` and `footer.ejs` are
  included on every page so we don't repeat code.
- **PostgreSQL** – all data is stored and retrieved using the `pg` library.

## 7. Research Component: EJS Partials

EJS partials were not fully covered in class, so we researched them. A partial
is a small reusable piece of a template. We created a `partials` folder with a
`header.ejs` and `footer.ejs`. Every page includes them like this:

```ejs
<%- include('../partials/header', { title: 'Books' }) %>
   ... page content ...
<%- include('../partials/footer') %>
```

This means our navbar and layout are written only once. If we want to change
the navigation menu, we only edit one file. This is a basic form of "layout
reuse".

## 8. Challenges We Faced

- Getting the include paths correct for the partials in sub-folders.
- Remembering to update the available copies when borrowing and returning.
- Setting up PostgreSQL and connecting it to Node for the first time.

## 9. Possible Future Improvements

- Add login for librarians
- Show overdue books on the dashboard
- Add search and filtering for books
- Add validation messages on the forms

## 10. Conclusion

This project helped us understand how a full server-side web application works,
from the database all the way to the rendered page. Every group member
contributed to a different part and we used GitHub to combine our work.
