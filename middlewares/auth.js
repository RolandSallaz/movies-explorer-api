const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');
const { messageAuthErr } = require('../utils/errorMessages');
const { JWT_SECRET } = require('../utils/config');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    const error = new AuthError(messageAuthErr);
    next(error);
  }
  req.user = payload;
  next();
};
