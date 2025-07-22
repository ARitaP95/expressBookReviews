const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Rota de registo de utilizadores
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" });
});

// Obter todos os livros
public_users.get('/', function (req, res) {
  res.status(200).send(JSON.stringify(books, null, 2));
});

// Obter livro por ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Obter livros por autor
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);

  if (booksByAuthor.length > 0) {
    res.status(200).json(booksByAuthor);
  } else {
    res.status(404).json({ message: "No books found for this author" });
  }
});

// Obter livros por título
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title === title);

  if (booksByTitle.length > 0) {
    res.status(200).json(booksByTitle);
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

// Obter reviews de um livro
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.status(200).json(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// ---------- AXIOS FUNCTIONS ----------

// Função com Promises para listar todos os livros
function getBooksUsingAxios() {
  axios.get('http://localhost:5000/')
    .then(response => {
      console.log("Livros disponíveis (Promises):");
      console.log(response.data);
    })
    .catch(error => {
      console.error("Erro ao obter livros:", error.message);
    });
}

// Função async-await para obter livro por ISBN
const getBookByISBN = async (isbn) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(`Detalhes do livro com ISBN ${isbn}:`);
    console.log(response.data);
  } catch (error) {
    console.error("Erro ao obter detalhes do livro:", error.message);
  }
};

// Obter livros por autor usando async/await com Axios
const getBooksByAuthor = async (author) => {
    try {
      const response = await axios.get(`http://localhost:5000/author/${author}`);
      console.log(`Livros do autor "${author}":`);
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao obter livros por autor:", error.message);
    }
  };

  // Função para obter detalhes de livros por título usando async/await
const getBooksByTitle = async (title) => {
    try {
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      console.log(`Livros com o título "${title}":`);
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao obter livros pelo título:", error.message);
    }
  };
  
// Exportar funções e router
module.exports = {
    getBooksUsingAxios,
    getBookByISBN,
    getBooksByAuthor,
    getBooksByTitle,
    general: public_users
  };
  
