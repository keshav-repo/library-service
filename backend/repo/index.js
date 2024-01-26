'use strict';

let sqlite3 = require('sqlite3'),
    { open } = require('sqlite'),
    q = require('q'),
    L = require('lgr'),
    { Sequelize, DataTypes } = require('sequelize'),
    BOOK_REPO = require('./bookRepo'),
    USER_REPO = require('./userRepo');

function repo(opts) {
    let self = this,
      deffered = q.defer();
   
     if(opts.isMySql){
        self.sequelize = new Sequelize({
            dialect: 'mysql',
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
          });
     }else{
          // SQLite database connection
        self.dbPath = 'database/library.db';
        self.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: self.dbPath, // SQLite database file
        });
     } 
      
    self.bookRepo = new BOOK_REPO(opts, self.sequelize);
    self.userRepo = new USER_REPO(opts, self.sequelize);
}

repo.prototype.initialise = function(){
     // Create the table if it doesn't exist
     try{
        return this.sequelize.sync(); 
     }catch(err){
        L.error('error initiating db', err);
        return Promise.reject();
     }
}

module.exports = repo;
