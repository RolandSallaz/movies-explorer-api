const router = require('express').Router();
const { signOut, signIn, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateRegistration, validateLogin } = require('../middlewares/validations');
const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const { messageNotFoundErr } = require('../utils/errorMessages');

router.post('/signup', validateRegistration, createUser);
router.post('/signin', validateLogin, signIn);
router.use(auth);
router.post('/signout', signOut);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.all('*', (req, res, next) => { next(new NotFoundError(messageNotFoundErr)); });

module.exports = router;
