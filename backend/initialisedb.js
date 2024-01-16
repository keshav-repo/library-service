'use strict';

let sqlite3 = require('sqlite3'),
  { open } = require('sqlite'),
  q = require('q'),
  L = require('lgr');

function initialiseDb(opts) {
  let self = this;
  // SQLite database connection
  self.dbPath = 'database/library.db';
}

initialiseDb.prototype.openConnection = function(){
  let self = this;
  let deffered = q.defer();
  let db;
  q(undefined)
    .then(function () {
      return open({
        filename: self.dbPath,
        driver: sqlite3.Database,
      })
    })
    .then(function (dbconn) {
      db = dbconn;
      db.exec(`
         CREATE TABLE IF NOT EXISTS users (
           id INTEGER PRIMARY KEY,
           username TEXT UNIQUE NOT NULL,
           password TEXT NOT NULL,
           role TEXT NOT NULL
         );
     
         CREATE TABLE IF NOT EXISTS books (
           id INTEGER PRIMARY KEY,
           title TEXT NOT NULL,
           author TEXT NOT NULL,
           available BOOLEAN NOT NULL
         );
       `);
    })
    .then(function (response) {
      L.info('successful db connection and initial table setup');
      deffered.resolve(db);
    })
    .catch(function (err) {
      L.error('error in db', err);
      deffered.reject(err);
    })

  return deffered.promise;
}

module.exports = initialiseDb;