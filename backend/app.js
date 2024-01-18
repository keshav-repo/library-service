'use strict';

let express = require('express'),
    bodyParser = require('body-parser'),
    ROUTES = require('./routes'),
    CONTROLLER = require('./controllers'),
    initialiseDb = require('./initialisedb'),
    L = require('lgr'),
    q = require('q'),
    jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(bodyParser.json());

let opts = {};

let initialiseDbObj = new initialiseDb();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
    const secretKey = 'your-secret-key';
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
      }
  
      req.user = user;
      next();
    });
  };

q(undefined)
    .then(function(){
        return initialiseDbObj.openConnection();
    })
    .then(function(db){
        opts.db = db;
        L.info('successful db connection');

        let router = express.Router();
        let controllers = new CONTROLLER(opts);
        let routes = new ROUTES(opts, controllers, router, authenticateToken);

        app.use('/', router);

        app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        });
    })
    .catch(function(err){
        L.info('error in db connection', err);
    })

