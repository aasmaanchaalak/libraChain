const express = require('express');
const cors = require('cors');
var url = require('url');
var exec = require('child_process').exec,
    child;

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
app.get('/admin', (req, res) => {
    child = exec('node enrollAdmin',
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        res.json(stdout);
        if (error !== null) {
        console.log('exec error: ' + error);
        res.json(error);
        }
    });
  //res.json(books);
});

app.get('/register', (req, res) => {
    var q = url.parse(req.url, true).query;
    var id = q.id;
    child = exec(`node registerUser`,
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        res.json(stdout);
        if (error !== null) {
        console.log('exec error: ' + error);
        res.json(error);
        }
    });
  //res.json(books);
});

app.get('/student', (req, res) => {
    var q = url.parse(req.url, true).query;
    var email = q.email;
    var name = q.name;
    child = exec(`node invoke registerStudent ${email} ${name}`,
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        res.json(stdout);
        if (error !== null) {
        console.log('exec error: ' + error);
        res.json(error);
        }
    });
  //res.json(books);
});

app.get('/login', (req, res) => {
    var q = url.parse(req.url, true).query;
    var email = q.email;
    child = exec('node query loginStudent ${email}',
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        res.json(stdout);
        if (error !== null) {
        console.log('exec error: ' + error);
        res.json(error);
        }
    });
  //res.json(books);
});

app.get('/catalogue', (req, res) => {
    var q = url.parse(req.url, true).query;
    var id = q.id;
    child = exec(`node query getCatalogue`,
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        res.json(JSON.parse(stdout));
        if (error !== null) {
        console.log('exec error: ' + error);
        res.json(error);
        }
    });
  //res.json(books);
});

app.get('/find', (req, res) => {
    var q = url.parse(req.url, true).query;
    var id = q.id;
    var name = q.name;
    var author = q.author ? q.author : "NA";
    var genre = q.genre ? q.genre : "NA";
    child = exec(`node query findBook ${name} ${author} ${genre}`,
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        res.json(JSON.parse(stdout));
        if (error !== null) {
        console.log('exec error: ' + error);
        res.json(error);
        }
    });
  //res.json(books);
});

app.get('/add', (req, res) => {
    var q = url.parse(req.url, true).query;
    var id = q.id;
    var name = q.name;
    var author = q.author ? q.author : "";
    var genre = q.genre ? q.genre : "";
    child = exec(`node invoke addBook ${id} ${name} ${author} ${genre}`,
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        res.json(stdout);
        if (error !== null) {
        console.log('exec error: ' + error);
        res.json(error);
        }
    });
  //res.json(books);
});

app.get('/update', (req, res) => {
    var q = url.parse(req.url, true).query;
    var id = q.id;
    var name = q.name;
    var author = q.author ? q.author : "";
    var genre = q.genre ? q.genre : "";
    child = exec(`node invoke updateBook ${id} ${name} ${author} ${genre}`,
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        res.json(stdout);
        if (error !== null) {
        console.log('exec error: ' + error);
        res.json(error);
        }
    });
  //res.json(books);
});

app.get('/issue', (req, res) => {
    var q = url.parse(req.url, true).query;
    var id = q.id;
    var name = q.name;
    child = exec(`node invoke issueBook ${id} ${name}`,
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        res.json(stdout);
        if (error !== null) {
        console.log('exec error: ' + error);
        res.json(error);
        }
    });
  //res.json(books);
});

app.get('/return', (req, res) => {
    var q = url.parse(req.url, true).query;
    var id = q.id;
    var name = q.name;
    child = exec(`node invoke returnBook ${id} ${name}`,
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        res.json(stdout);
        if (error !== null) {
        console.log('exec error: ' + error);
        res.json(error);
        }
    });
  //res.json(books);
});

app.get('/current', (req, res) => {
    var q = url.parse(req.url, true).query;
    var id = q.id;
    var name = q.name;
    child = exec(`node query getUser ${id}`,
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        res.json(stdout);
        if (error !== null) {
        console.log('exec error: ' + error);
        res.json(error);
        }
    });
  //res.json(books);
});

app.get('/users', (req, res) => {
    var q = url.parse(req.url, true).query;
    var id = q.id;
    child = exec(`node query getUsers`,
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        res.json(stdout);
        if (error !== null) {
        console.log('exec error: ' + error);
        res.json(error);
        }
    });
  //res.json(books);
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
