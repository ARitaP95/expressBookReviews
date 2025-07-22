const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some((user) => user.username === username);
}

const authenticatedUser = (username, password) => {
  return users.some((user) => user.username === username && user.password === password);
}


regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Verifica se o utilizador existe e a password está correta
  const user = users.find(user => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Gera o token JWT
  const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });

  // Guarda o token na sessão
  req.session.authorization = {
    accessToken,
    username,
  };

  return res.status(200).json({ message: "User successfully logged in", token: accessToken });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    const token = req.session.authorization?.accessToken;
  
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. No token found." });
    }
  
    let username;
    try {
      const decoded = jwt.verify(token, "access");
      username = decoded.username;
    } catch (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
  
    const isbn = req.params.isbn;
    const review = req.query.review;
  
    if (!review) {
      return res.status(400).json({ message: "Review is required in query" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
  
    // Adiciona ou atualiza a review com o username como chave
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({ message: "Review added/updated successfully" });
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
  
    // Verifica se o livro existe
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Verifica se há uma review do utilizador
    if (
      books[isbn].reviews &&
      books[isbn].reviews[username]
    ) {
      delete books[isbn].reviews[username];
      return res.status(200).json({
        message: `Review by '${username}' deleted for book with ISBN ${isbn}`
      });
    } else {
      return res.status(404).json({
        message: `No review found by '${username}' for book with ISBN ${isbn}`
      });
    }
  });
  
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
