'use strict';

function bookRouters(opts, controllers, router){
    router.get('/api/books', function(req, res){
        controllers.bookController.getBooks(req, res);
    });
    router.post('/api/books',function(req, res){
        controllers.bookController.addBook(req, res);
    });
    router.put('/api/books/borrow/:bookId', function(req, res){ 
        controllers.bookController.borrowBook(req, res);
    });
    router.put('/api/books/return/:bookId',  function(req, res){ 
        controllers.bookController.returnBook(req, res);
    });
}

module.exports = bookRouters;
