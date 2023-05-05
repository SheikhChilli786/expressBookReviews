const axios = require('axios').default;
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


function getBooks() {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:5000/books')
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

public_users.get('/', function (req, res) {
  getBooks()
    .then(books => {
      res.send(JSON.stringify({ books }, null, 4));
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('An error occurred while getting books');
    });
});




public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
  
});



public_users.get('/books',function (req, res) {
    res.send(books);
});


// Get book details based on ISBN


async function getBookDetails(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/books/${isbn}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await getBookDetails(isbn);
    res.send(JSON.stringify({ book }, null, 4));
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while getting book details');
  }
});

public_users.get('/books/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    if(books[isbn]){
        res.send(books[isbn])
    }else{
        res.send("couldn,t find the book with given isbn");
    }
 });


 function getBooksByAuthor(author) {
   return new Promise((resolve, reject) => {
     axios.get(`http://localhost:5000/book/${author}`)
       .then(response => {
         resolve(response.data);
       })
       .catch(error => {
         reject(error);
       });
   });
 }
 
 public_users.get('/author/:author', function (req, res) {
   const author = req.params.author;
   getBooksByAuthor(author)
     .then(books => {
       res.send(JSON.stringify({ books }, null, 4));
     })
     .catch(error => {
       console.error(error);
       res.status(500).send('An error occurred while getting books by author');
     });
 });
 
// Get book details based on author
public_users.get('/book/:author',function (req, res) {
    let author = req.params.author;
    let booksWithSameAuthor = [];
    for(i=1;i<=10;i++){
        if(books[i].author==author){
            booksWithSameAuthor.push(books[i]);
        }
    }
    res.send(booksWithSameAuthor);
});

function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
      axios.get(`http://localhost:5000/dooks/${title}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  
  public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    getBooksByTitle(title)
      .then(books => {
        res.send(JSON.stringify({ books }, null, 4));
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('An error occurred while getting books by title');
      });
  });
// Get all books based on title
public_users.get('/dooks/:title',function (req, res) {
    let title = req.params.title;
    for(i=1;i<=10;i++){
        if(books[i].title==title){
           res.send(books[i]);
        }
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;


