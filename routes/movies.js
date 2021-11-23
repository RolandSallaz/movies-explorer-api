const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const { getMovies, addMovie, deleteMovie } = require('../controllers/movies');
const ValidationError = require('../errors/ValidationError');

const validateURL = (link) => {
  if (!validator.isURL(link, { require_protocol: true })) {
    throw new ValidationError('Неверно указана ссылка');
  }
  return link;
};

router.get('/', getMovies);
router.post('/', celebrate({
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
}), addMovie);
router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = router;
