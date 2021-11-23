const NoPermissionError = require('../errors/NoPermissionError');
const NotFoundError = require('../errors/NotFoundError');
const Movie = require('../models/movie');

function getMovies(req, res, next) {
  return Movie.find({})
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
}
function addMovie(req, res, next) {
  const {
    country, director, duration, year, description, image, trailer, thumbnail, movieId, nameRU,
    nameEN,
  } = req.body;
  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
}
function deleteMovie(req, res, next) {
  const { id } = req.params;
  const userId = req.user._id;
  return Movie.findById(id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (movie.owner.toString() !== userId) {
        throw new NoPermissionError('Недостаточно прав');
      }
      return Movie.findByIdAndDelete(id)
        .then(() => {
          res
            .send({ message: 'Успешно' });
        })
        .catch(next);
    })
    .catch(next);
}
module.exports = { getMovies, addMovie, deleteMovie };
