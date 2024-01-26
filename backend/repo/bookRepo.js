'use strict';

const {DataTypes } = require('sequelize'),
        q = require('q'),
        L = require('lgr');

function bookRepo(opts, sequelize){
    var self = this;
    self.sequelize = sequelize;
    self.Book = sequelize.define('books', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        author: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        available: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          default: true
        },
      });
}

bookRepo.prototype.save = function(book){
    var self = this,
        deffered = q.defer();

    self.Book.create(book)
        .then(function(bookCreated){
            deffered.resolve(bookCreated.toJSON())
        })
        .catch(function(err){
            deffered.reject(err);
        })
    return deffered.promise;
}

bookRepo.prototype.findAll = function(book){
    var self = this,
        deffered = q.defer();

    self.Book.findAll()
        .then((books) => {
          deffered.resolve(  books.map(book => book.toJSON()) );
        })
        .catch((error) => {
            deffered.reject(error);
        });
    return deffered.promise;
}

bookRepo.prototype.findByID = function(bookId){
    var self = this,
        deffered = q.defer();

    self.Book.findByPk(bookId)
        .then((book) => {
          deffered.resolve( book.toJSON() );
        })
        .catch((error) => {
            deffered.reject(error);
        });
    return deffered.promise;
}

bookRepo.prototype.updateAvailability = function (bookId, isAvailable) {
    var self = this,
        deffered = q.defer();
    self.Book.update(
        { available: isAvailable },
        {
            where: {
                id: bookId,
            },
        }
    )
    .then(function (updateRes) {
        deffered.resolve(updateRes);
    })
    .catch((error) => {
        deffered.reject(error);
    });
    return deffered.promise;
}

module.exports = bookRepo;
