'use strict';

function bookRouters(opts, controllers, router, authenticateToken){
    router.get('/api/books', authenticateToken, function(req, res){
        controllers.bookController.getBooks(req, res);
    });
    router.post('/api/books',authenticateToken, function(req, res){
        controllers.bookController.addBook(req, res);
    });
    router.put('/api/books/borrow/:bookId', authenticateToken, function(req, res){ 
        controllers.bookController.borrowBook(req, res);
    });
    router.put('/api/books/return/:bookId', authenticateToken, function(req, res){ 
        controllers.bookController.returnBook(req, res);
    });
}

module.exports = bookRouters;
