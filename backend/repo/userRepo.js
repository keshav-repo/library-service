'use strict';

var { DataTypes } = require('sequelize'),
  q = require('q'),
  L = require('lgr');

function userRepo(opts, sequelize) {
  var self = this;
  self.sequelize = sequelize;
  self.User = sequelize.define('users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true
    },
  });
}

userRepo.prototype.save = async function (user) {
  var self = this,
    deffered = q.defer();

  self.User.create(user)
    .then(function (createdRes) {
      deffered.resolve(createdRes.toJSON())
    })
    .catch(function (err) {
      deffered.reject(err);
    })
  return deffered.promise;
}

userRepo.prototype.findByUsername = async function (username) {
  var self = this,
    deffered = q.defer();

  self.User.findOne({
    where: {
      username: username,
    },
  })
    .then(function (createdRes) {
       createdRes==null ? deffered.resolve(null):  deffered.resolve(createdRes.toJSON());
    })
    .catch(function (err) {
      deffered.reject(err);
    })
  return deffered.promise;
}

userRepo.prototype.findAll = function(book){
  var self = this,
      deffered = q.defer();

  self.User.findAll()
      .then((users) => {
        deffered.resolve(  users.map(user => user.toJSON()) );
      })
      .catch((error) => {
          deffered.reject(error);
      });
  return deffered.promise;
}


module.exports = userRepo;
