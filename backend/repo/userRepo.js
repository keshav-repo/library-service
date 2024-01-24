'use strict';

const {DataTypes } = require('sequelize');

function userRepo(opts, sequelize){
    var self = this;
    self.sequelize = sequelize;
    self.User = sequelize.define('User', {
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
      });
}

userRepo.prototype.save = async function(book){
    
}

module.exports = userRepo;
