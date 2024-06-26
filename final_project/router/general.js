const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
/*public_users.get('/',function (req, res) {
  //Write your code here
 res.send(JSON.stringify(books,null,4));
});*/

function getBooks() {
  return new Promise((resolve, reject) => {
      resolve(books);
  });
}

public_users.get('/', async function (req, res) {
  const book = await getBooks();
  res.send(JSON.stringify(book));
});

// Get book details based on ISBN
/*public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });*/


 function getISBN(isbn) {
  return new Promise((resolve, reject) => {
      let num = parseInt(isbn);
      if (books[num]) {
          resolve(books[num]);
      } else {
          reject({status:404, message:`ISBN ${isbn} not found`});
      }
  })
}

public_users.get('/isbn/:isbn', function (req, res) {
  getISBN(req.params.isbn)
  .then(
      result => res.send(result),
      error => res.status(error.status).json({message: error.message})
  );
});
  
// Get book details based on author
/*public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let booksArray = Object.values(books);
  let filteredAuthor = booksArray.filter((book) => book.author === author);
  res.send(filteredAuthor);
});*/


// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  getBooks()
  .then((booksArray) => Object.values(booksArray))
  .then((books) => books.filter((book) => book.author === author))
  .then((filteredBooks) => res.send(filteredBooks));
});

// Get all books based on title
/*public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let booksArray = Object.values(books);
  let filteredTitle = booksArray.filter((book) => book.title === title);
  res.send(filteredTitle);
});*/

public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  getBooks()
  .then((booksArray) => Object.values(booksArray))
  .then((books) => books.filter((book) => book.title === title))
  .then((filteredBooks) => res.send(filteredBooks));
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book){
    res.send(book.reviews)
  } else {
    res.send("Unable to find book!");
  }

});

module.exports.general = public_users;
