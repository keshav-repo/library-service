'use strict';

var User = require('../models/User'),
  L = require('lgr'),
  bcrypt = require('bcrypt');

function userController(opts) {
  var self = this;
  self.db = opts.db;
  self.MAX_STUDENT_BORROW_LIMIT = 3;
}

userController.prototype.getUsers = async function (req, res) {
  var self = this;
  const users = await self.db.all('SELECT * FROM users');
  res.json(users);
}

// exports.addUser = (req, res) => {
//   const newUser = new User(users.length + 1, req.body.username, req.body.role);

//   // Set borrow limit for students
//   if (req.body.role === 'student') {
//     newUser.borrowLimit = MAX_STUDENT_BORROW_LIMIT;
//   }

//   users.push(newUser);
//   res.status(201).json(newUser);
// };


userController.prototype.addUser = async function (req, res) {
  var self = this;
  const { username, password, role } = req.body;

  // Check if the username is already taken
  const existingUser = await self.db.get('SELECT * FROM users WHERE username = ?', username);

  if (existingUser) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await self.db.run(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      username,
      hashedPassword,
      role
    );
    const newUser = new User(result.lastID, username, role);
    res.status(201).json(newUser);
  } catch (err) {
    L.error(err);
    res.status(500).json({
      'message': 'Internal error'
    })
  }
}

module.exports = userController;
