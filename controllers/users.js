const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

function getCurrentUser(req, res, next) {
  return User.findById(req.user)
    .then((user) => {
      res.send({ email: user.email, name: user.name });
    })
    .catch(next);
}
function updateUser(req, res, next) {
  const { name } = req.body;
  return User.findByIdAndUpdate(req.user, { name }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ email: user.email, name: user.name });
    })
    .catch(next);
}
function createUser(req, res, next) {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => {
      res
        .send({
          name: user.name, email,
        });
    })
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        const error = new Error('Данный email уже используется');
        error.statusCode = 409;
        next(error);
        return;
      }
      next(err);
    });
}
function signIn(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const { JWT_SECRET = 'secretKeyForDevelop' } = process.env;
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res
        .cookie('jwt', token, {
          maxAge: 60 * 60 * 24 * 7 * 1000,
          httpOnly: true,
        })
        .send({ message: 'Выполнен вход в учетную запись' });
    })
    .catch(next);
}

function signOut(req, res) {
  return res.clearCookie('jwt')
    .status(200)
    .send({ message: 'Выполнен выход из учетной записи' });
}
module.exports = {
  getCurrentUser, updateUser, createUser, signIn, signOut,
};
