const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const ValidationError = require('../errors/ValidationError');
const { messageUrlErr } = require('../utils/errorMessages');

const validateURL = (link) => {
  if (!validator.isURL(link, { require_protocol: true })) {
    throw new ValidationError(messageUrlErr);
  }
  return link;
};
const validateRegistration = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});
const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});
const validateMoviePost = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(validateURL).required(),
    trailer: Joi.string().custom(validateURL).required(),
    thumbnail: Joi.string().custom(validateURL).required(),
    nameRU: Joi.string().regex(/^[а-яА-Я1-9]+/).required(),
    nameEN: Joi.string().regex(/^\w+/).required(),
    movieId: Joi.number().required(),
  }),
});
const validateMovieDelete = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});
const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
  }),
});
module.exports = {
  validateRegistration,
  validateLogin,
  validateMoviePost,
  validateMovieDelete,
  validateUserUpdate,
};
