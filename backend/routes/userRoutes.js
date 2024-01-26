'use strict';

function userRoutes(opts, controllers, router, authenticateToken){

    router.get('/api/users', authenticateToken, function(req, res){
        controllers.userController.getUsers(req, res);
    });
    router.post('/api/users', function(req, res){
        controllers.userController.addUser(req, res);
    });
    router.post('/api/users/login', function(req, res){
        controllers.userController.login(req, res);
    });
    router.post('/api/users/refresh', function(req, res){
        controllers.userController.refresh(req, res);
    });

}

module.exports = userRoutes;
