const router = require('express').Router();
const { getMovies, addMovie, deleteMovie } = require('../controllers/movies');
const { validateMoviePost, validateMovieDelete } = require('../middlewares/validations');

router.get('/', getMovies);
router.post('/', validateMoviePost, addMovie);
router.delete('/:id', validateMovieDelete, deleteMovie);

module.exports = router;
