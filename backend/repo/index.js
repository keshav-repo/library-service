'use strict';

let sqlite3 = require('sqlite3'),
    { open } = require('sqlite'),
    q = require('q'),
    L = require('lgr'),
    { Sequelize, DataTypes } = require('sequelize'),
    BOOK_REPO = require('./bookRepo'),
    USER_REPO = require('./bookRepo');

function repo(opts) {
    let self = this;
    // SQLite database connection
    self.dbPath = 'database/library.db';

    let deffered = q.defer();

    self.sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: self.dbPath, // SQLite database file
    });

    self.bookRepo = new BOOK_REPO(opts, self.sequelize);
}

repo.prototype.initialise = function(){
     // Create the table if it doesn't exist
     return this.sequelize.sync(); 
}

module.exports = repo;
