'use strict';

var User = require('../models/User'),
  L = require('lgr'),
  bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken');

function userController(opts) {
  var self = this;
  self.db = opts.db;
  self.MAX_STUDENT_BORROW_LIMIT = 3;
  self.refreshTokenSecret = 'your-refresh-token-secret';
  self.secretKey = 'your-secret-key';
}

userController.prototype.getUsers = async function (req, res) {
  var self = this;
  const users =   await self.db.userRepo.findAll();
  res.json(self.formatReponse(users));
}


userController.prototype.formatReponse = function(users){
  return users.map((user) => {
    const { id, username} = user;
    return { id, username };
  });
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

  try{
    // Check if the username is already taken  
    const existingUser = await self.db.userRepo.findByUsername(username);

    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }
  }catch(err){
    L.error('error checking if existing user', err);
    return res.status(500).json({
      'message': 'Internal error'
    })
  }
  

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await self.db.userRepo.save({
      username: username,
      password: hashedPassword
    });
    let newUser = new User(result.lastID, username, role);
    res.status(201).json(newUser);
  } catch (err) {
    L.error(err);
    res.status(500).json({
      'message': 'Internal error'
    })
  }
}

userController.prototype.generateRefreshToken = function(userId){
  var self = this;
  const refreshToken = jwt.sign({ userId }, self.refreshTokenSecret, { expiresIn: '7d' });

  return refreshToken;
};

userController.prototype.login = async function(req, res){
  const { username, password } = req.body;
  let self = this;

  const user = await self.db.userRepo.findByUsername(username);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  try{   
    const match = await bcrypt.compare(password, user.password);
    if(match){
      const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, self.secretKey, {
        expiresIn: '1h', // Set the expiration time for the token (e.g., 1 hour)
     });

     const refreshToken = await self.generateRefreshToken(user.id);

     res.json({ token, refreshToken, message: 'Login successful' });
    }else{
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  }catch(err){
    L.error('error creating jwt token', err);
    return res.status(500).json({ message: 'Internal error' });
  }
}

userController.prototype.refresh = async function(req, res){
  const refreshToken = req.body.refreshToken;
  var self = this;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Bad Request: Missing refresh token' });
  }
  try {
    // Verify the refresh token
    jwt.verify(refreshToken,  self.refreshTokenSecret, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid refresh token' });
      }

      // Generate a new access token
      const accessToken = jwt.sign({ userId: user.userId, username: user.username, role: user.role }, self.secretKey, {
        expiresIn: '1h',
      });

      res.json({ accessToken, message: 'Token refreshed successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }    
}

module.exports = userController;
