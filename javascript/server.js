const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to parse JSON in request body
app.use(express.json());

app.use(cors());

// Sample collection of books
let books = [
  { id: 1, title: 'Book 1', author: 'Author 1' },
  { id: 2, title: 'Book 2', author: 'Author 2' },
];

// GET /books endpoint to fetch all books
app.get('/books', (req, res) => {
  res.json(books);
});

// POST /books endpoint to add a new book
app.post('/books', (req, res) => {
  const newBook = { id: books.length + 1, title: req.body.title, author: req.body.author };
  books.push(newBook);
  res.status(201).json(newBook);
});

// DELETE /books/:id endpoint to delete a book by ID
app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  books = books.filter((book) => book.id !== bookId);
  res.sendStatus(204);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
