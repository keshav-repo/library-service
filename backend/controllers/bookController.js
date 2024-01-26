let Book = require('../models/Book'),
  L = require('lgr'),
  _ = require('underscore');

function bookController(opts) {
  let self = this;
  self.db = opts.db;
  self.borrowLimit = 3;
}

bookController.prototype.getBooks = async function (req, res) {
  var self = this;
  try {
    const books = await self.db.bookRepo.findAll();
    let formattedRes = self.formatReponse(books);
    res.json( formattedRes );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

bookController.prototype.addBook = async function (req, res) {
  var self = this;

  if (Array.isArray(req.body)) {
    let books = req.body;
    if (books.length == 0) {
      L.info('books info is empty');
      return res.status(422).json({ error: 'Missing book information. Please provide valid book details.' });
    }

    books.forEach((book) => {
      book.available = true;
    });

    // Extract values from the array of books
    let values = books.map(book => [book.title, book.author, book.available ]);

    var query = "INSERT INTO books (title, author, available) VALUES (?, ?, ?)";
    values = [values.flat()];

    // Use a single INSERT statement with multiple values
    self.db.run(query, values, (err) => {
      if (err) {
        L.info('Error inserting books into the database.', err);
        return res.status(500).json({ error: 'Server error' });
      }

      res.json({ message: 'Books added successfully.' });
    });

  }
  else {
    const { title, author } = req.body;

    try {
      var newBook = new Book(title, author, true);
      newBook = await self.db.bookRepo.save(newBook);
      res.status(201).json({
        id: newBook.id,
        title: newBook.title,
        author: newBook.author, 
        available: newBook.available
      });
    } catch (err) {
      L.error('error saving new book', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

};

bookController.prototype.borrowBook = async function (req, res) {
  const bookId = parseInt(req.params.bookId);

  var self = this,
      book ;
  try{
     book = await self.db.bookRepo.findByID(bookId);
     if (!book || book.available == 0) {
      return res.status(404).json({ message: 'Book not found or not available' });
    }  
  }catch(err){
    L.error('error fetching book by bookid', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
 
  // Check user role and borrowing limit for students
  const userRole = req.headers['x-role'];
  const userId = parseInt(req.headers['x-user-id']);

  try {
    await self.db.bookRepo.updateAvailability(bookId, false);
  } catch (err) {
    L.error('error updating the book to unavailable');
  }

  return res.json({ message: 'Book borrowed successfully!' });
};

bookController.prototype.returnBook = async function (req, res) {
  const bookId = parseInt(req.params.bookId);

  var self = this,
      book;
  try {
    book = await self.db.bookRepo.findByID(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found'});
    }
    else if (book.available == 1) {
      return res.status(404).json({ message: 'Book is already available' });
    }
  } catch (err) {
    L.error('error fetching book by bookid', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  try {
    await self.db.bookRepo.updateAvailability(bookId, true);
    res.json({ message: 'Book returned successfully!' });
  } catch (err) {
    L.error('error updating the book to available');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

bookController.prototype.formatReponse = function(books){
  return books.map((book) => {
    const { id, title, author, available } = book;
    return { id, title, author, available };
  });
}

module.exports = bookController;
