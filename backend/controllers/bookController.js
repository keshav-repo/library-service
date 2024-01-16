let Book = require('../models/Book'),
    L = require('lgr');

function bookController(opts){
  let self = this;
  self.db = opts.db;
  self.borrowLimit = 3;
}

bookController.prototype.getBooks = async function(req, res){
  var self = this;
  try{
    const books = await self.db.all('SELECT * FROM books');
    res.json(books);
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

bookController.prototype.addBook = async function(req, res){
  const { title, author } = req.body,
      self = this;

  try{
    const result = await self.db.run(
      'INSERT INTO books (title, author, available) VALUES (?, ?, ?)',
      title,
      author,
      true 
    );
  
    const newBook = new Book( result.id, title, author, true);
    books.push(newBook);
    res.status(201).json(newBook);
  }catch(err){
    L.error('error saving new book', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

bookController.prototype.borrowBook = async function(req, res){
    const bookId = parseInt(req.params.bookId);

    var self = this;
    const book = await self.db.get('SELECT * FROM books WHERE id = ?', bookId);

    if (!book || book.available == 0) {
      return res.status(404).json({ message: 'Book not found or not available' });
    }
  
    // Check user role and borrowing limit for students
    const userRole = req.headers['x-role'];
    const userId = parseInt(req.headers['x-user-id']);
  
    let user;
    try{
        user = await self.db.get('SELECT * FROM users WHERE id = ?', userId);
    }catch(err){
      L.error('error fetching user info')
    }

    if (!user) {
      return res.status(403).json({ message: 'Exceeded borrowing limit' });
    }

    try{
      await self.db.run('UPDATE books SET available = ? WHERE id = ?', false, bookId);
    }catch(err){
        L.error('error updating the book to unavailable');
    }

    return res.json({ message: 'Book borrowed successfully!' });
};
  
bookController.prototype.returnBook = async function(req, res){
    const bookId = parseInt(req.params.bookId);
    
    var self = this;
    const book = await self.db.get('SELECT * FROM books WHERE id = ?', bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if(book.available==1){
      return res.status(404).json({ message: 'Book is already available'});
    }

    try{
      await self.db.run('UPDATE books SET available = ? WHERE id = ?', true, bookId);
      res.json({ message: 'Book returned successfully!' });
    }catch(err){
        L.error('error updating the book to available');
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = bookController;
