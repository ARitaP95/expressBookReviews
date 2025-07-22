const { getBooksUsingAxios, getBookByISBN } = require('./general.js');

// Testar a obtenção da lista de livros com Promises
getBooksUsingAxios();

// Testar a obtenção de detalhes de um livro por ISBN com async/await
// Podes mudar o ISBN "3" por outro número de 1 a 10 conforme a tua base de dados
getBookByISBN("3");

