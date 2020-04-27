'use strict';

require('dotenv').config();

const express = require('express');

const PORT = process.env.PORT || 3000;

const app = express();

app.set ('view engine', 'ejs');

app.use( express.urlencoded({extended:true }));

app.use( express.static('./www') );

// This is a good one
app.get('/', (request, response) => {
  response.status(200).send('Hello World');
});

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

// 404 Handler
app.use('*', (request, response) => {
  console.log(request);
  response.status(404).send(`Can't Find ${request.pathname}`);
});

// Error Handler
app.use( (err,request,response,next) => {
  console.error(err);
  response.status(500).send(err.message);
});

app.get ('/searchForm', (request, response) => {
  response.status(200).render('pages/search-form');
});

app.post ('/search', (request, response) => {
  let url = 'https://www.googleapis.com/books/v1/volumes';
  let queryObject = { q:`${request.body.searchby}: ${request.body.search}`,
  };
superagent.get (url)
.query(queryObject)
.then(results => {let books = results.body.items.map(book => new Book(book.volumeInfo)); // added volumeInfo
response.staus (200).render('pages/search-results', {books:books});
});

});

// function Book(data){
//   this.title = data.volumeInfo.title; 
//   // this.author = 
// }

function Book(data) {
  this.title = data.volumeInfo.title;
  this.author = data.authors
  this.description = data.description
}
// Startup

function startServer() {
  app.listen( PORT, () => console.log(`Server running on ${PORT}`));
}

startServer();