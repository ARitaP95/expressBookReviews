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


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
