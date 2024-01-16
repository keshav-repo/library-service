'use strict';

let express = require('express'),
    bodyParser = require('body-parser'),
    ROUTES = require('./routes'),
    CONTROLLER = require('./controllers'),
    initialiseDb = require('./initialisedb'),
    L = require('lgr'),
    q = require('q');

const app = express();
const port = 3000;

app.use(bodyParser.json());

let opts = {};

let initialiseDbObj = new initialiseDb();

q(undefined)
    .then(function(){
        return initialiseDbObj.openConnection();
    })
    .then(function(db){
        opts.db = db;
        L.info('successful db connection');

        let router = express.Router();
        let controllers = new CONTROLLER(opts);
        let routes = new ROUTES(opts, controllers, router);
        app.use('/', router);

        app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        });
    })
    .catch(function(err){
        L.info('error in db connection', err);
    })

