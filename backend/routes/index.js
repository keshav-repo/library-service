let bookRoutes = require('./bookRoutes'),
    userRoutes = require('./userRoutes');


function routes(opts, controllers, router, authenticateToken){
    let self = this;
    self.bookRoutes = new bookRoutes(opts, controllers, router, authenticateToken);
    self.userRoutes = new userRoutes(opts, controllers, router, authenticateToken);
}

module.exports = routes;
