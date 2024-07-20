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
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user. Username or password not provided."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  try {
    const data = await Promise.resolve(books);
    res.json(data);
  } catch (error) {
    res.status(500).send("Error fetching book list");
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  try {
    const data = await Promise.resolve(books);
    if(req.params.isbn in books === false){
      res.send("Unable to find the book with the given ISBN");
    } else{
      res.json(data[req.params.isbn]);
    }
  } catch (error) {
    res.status(500).send("Error fetching book list");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  try {
    const data = await Promise.resolve(books);

    let booksWithTheAuthor = Object.values(data).filter((book)=>{
      return book["author"].toLowerCase() === req.params.author.toLowerCase();
    })
  
    if(booksWithTheAuthor.length === 0){
      res.send("Unable to find the book with the given author");
    } else {
      res.json(booksWithTheAuthor);
    }
  } catch (error) {
    res.status(500).send("Error fetching book list");
  }

});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here

  try {
    const data = await Promise.resolve(books);
    
    let booksWithTheTitle = Object.values(data).filter((book)=>{
      return book["title"].toLowerCase() === req.params.title.toLowerCase();
    })
  
    if(booksWithTheTitle.length === 0){
      res.send("Unable to find the book with the given title");
    } else {
      res.json(booksWithTheTitle);
    }
  } catch (error) {
    res.status(500).send("Error fetching book list");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  if(req.params.isbn in books === false){
    res.send("Unable to find the book with the given ISBN");
  } else {
    res.json(books[req.params.isbn]["reviews"]);
  }
});

module.exports.general = public_users;
