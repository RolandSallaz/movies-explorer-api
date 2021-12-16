const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const User = require('../models/user');
const { messageEmailConflictErr, messageNotFoundErr } = require('../utils/errorMessages');
const { messageLoginSucces, messageLogOutSucces } = require('../utils/responeMessages');
const { JWT_SECRET } = require('../utils/config');

function getCurrentUser(req, res, next) {
  return User.findById(req.user)
    .then((user) => {
      res.send({ email: user.email, name: user.name });
    })
    .catch(next);
}
function updateUser(req, res, next) {
  const { email, name } = req.body;
  return User.findByIdAndUpdate(req.user, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(messageNotFoundErr);
      }
      res.send({ email: user.email, name: user.name });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(messageEmailConflictErr));
      }
      return next(err);
    });
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
      if (err.code === 11000) {
        return next(new ConflictError(messageEmailConflictErr));
      }
      return next(err);
    });
}
function signIn(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res
        .cookie('jwt', token, {
          maxAge: 60 * 60 * 24 * 7 * 1000,
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        .send({ message: messageLoginSucces });
    })
    .catch(next);
}

function signOut(req, res) {
  return res
    .clearCookie('jwt')
    .status(200)
    .send({ message: messageLogOutSucces });
}
module.exports = {
  getCurrentUser, updateUser, createUser, signIn, signOut,
};
