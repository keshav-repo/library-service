let userController = require('./userController'),
    bookController = require('./bookController');

function controllers(opts){
    let self = this;
    let controllers = {};
    // controllers.bookController = new bookController(opts);
    // controllers.userController = new userController(opts);

    self.bookController = new bookController(opts);
    self.userController = new userController(opts);

   // return controllers;
}

module.exports = controllers;
