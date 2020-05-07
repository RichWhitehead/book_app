'use strict';

require('dotenv').config();
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const PORT = process.env.PORT || 3000;
const app = express();
const client = new pg.Client (process.env.DATABASE_URL);
app.set ('view engine', 'ejs');
app.use( express.urlencoded({extended:true }));
app.use( express.static('./www'));






// app.get('/', (request, response) => {
//   response.status(200).send('Hello World');
// });

app.get('/person', (request, response) => {
  response.status(200).send(`Welcome, ${request.query.name}, your hair is ${request.query.hair}`);
});

app.post('/city', (request, response) => {
  response.status(200).send(request.body.article);
});


// This will force an error
app.get('/badthing', (request,response) => {
  throw new Error('WTF???');
});

//Routes
app.get ('/search-form', (request, response) => {
  response.status(200).render('pages/search-form');
});
// 
app.post ('/search', (request, response) => {
  let url = 'https://www.googleapis.com/books/v1/volumes';
  let queryObject = { 
    q:`${request.body.searchby}: ${request.body.search}`,
};
// console.log('queryObject', queryObject);
superagent.get (url)
.query(queryObject)
.then(results => {
  let books = results.body.items.map(book => new Book (book)); // added volumeInfo
  response.status(200).render('pages/search-results', {books: books});
});

});


function Book(data){
  let url = 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = data.volumeInfo.title || 'no title available'; 
  this.author = data.volumeInfo.authors;
  this.image = data.volumeInfo.imageLinks ? data.volumeInfo.imageLinks.thumbnail : url;
  this.description = data.volumeInfo.description;
  this.amount = data.saleInfo.listPrice ? data.saleInfo.listPrice.amount : ' Unknown.';
}

//Saving books
app.get('/', (request, response) => {
  const SQL = 'SELECT * FROM books';
  client.query(SQL)
    .then (results => {
      response.status(200).render('pages/index', {books:results.rows,});
    })
    .catch ( error => {
      throw new Error('Oh No! There is an Error!', error);
    });
});

// add new book to database

app.post('/add', (request, response) => {
  console.log('You are here');
  let SQL = `
    INSERT INTO books (authors, title, isbn, image_url, description, bookshelf, amount)
    VALUES ($1, $2, $3, $4, $5, $6, $7)`;

  let VALUES = [
    request.body.authors,
    request.body.title,
    request.body.isbn,
    request.body.image_url,
    request.body.description,
    request.body.bookshelf,
    request.body.amount
  ];
  client.query(SQL, VALUES)
    .then(results => {
      response.status(200).redirect('/');
    })
    .catch( error => {
      console.error(error.message);
    });
});

// delete book from database
// delete book from database
app.post('/delete/:id',(request,response) => {
  let id = request.body.id;
  const SQL = 'DELETE FROM books WHERE id=$1';
  const VALUES = [id];
  client.query(SQL, VALUES)
    .then( () => {
      response.status(200).redirect('/');
    })
    .catch( error => {
      console.error(error.message);
    });
});

// Force error
app.get('/error', () => {
  throw new Error('You Broke It!');
});

  
  // 404 Handler
  app.use('*', (request, response) => {
    // console.log(request);
    response.status(404).send(`Can't Find ${request.pathname}`);
  });
  
  // Error Handler
  app.use( (err,request,response,next) => {
    // console.error(err);
    response.status(500).send(err.message);
  });

  function startServer() {
  app.listen( PORT, () => console.log(`Server running on ${PORT}`));
}

client.connect()
.then ( () =>{
  startServer(PORT);
})
.catch(error => console.error(error.message));
// startServer();
