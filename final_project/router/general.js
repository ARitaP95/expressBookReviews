const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Verificar se o utilizador já existe
    const userExists = users.some(user => user.username === username);
  
    if (userExists) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    // Registar novo utilizador
    users.push({ username, password });
  
    return res.status(201).json({ message: "User registered successfully" });
  });
  

public_users.get('/', function (req, res) {
  res.status(200).send(JSON.stringify(books, null, 2));
});

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    const book = books[isbn];
  
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  });
  
  public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
  
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
  
    if (booksByAuthor.length > 0) {
      res.status(200).json(booksByAuthor);
    } else {
      res.status(404).json({ message: "No books found for this author" });
    }
  });

  public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
  
    const booksByTitle = Object.values(books).filter(book => book.title === title);
  
    if (booksByTitle.length > 0) {
      res.status(200).json(booksByTitle);
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  });
  
  public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    const book = books[isbn];
  
    if (book) {
      res.status(200).json(book.reviews);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  });
  

module.exports.general = public_users;
