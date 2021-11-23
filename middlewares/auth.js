const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  const { JWT_SECRET = 'secretKeyForDevelop' } = process.env;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    const error = new AuthError('Необходима авторизация');
    next(error);
  }
  req.user = payload;
  next();
};
