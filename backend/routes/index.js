let bookRoutes = require('./bookRoutes'),
    userRoutes = require('./userRoutes');


function routes(opts, controllers, router){
    let self = this;
    self.bookRoutes = new bookRoutes(opts, controllers, router);
    self.userRoutes = new userRoutes(opts, controllers, router);
}

module.exports = routes;
