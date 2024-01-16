'use strict';

function userRoutes(opts, controllers, router){

    router.get('/api/users', function(req, res){
        controllers.userController.getUsers(req, res);
    });
    router.post('/api/users', function(req, res){
        controllers.userController.addUser(req, res);
    });   
}

module.exports = userRoutes;
