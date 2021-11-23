const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { errors, celebrate, Joi } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const { signIn, signOut, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('../react-mesto-api-full/backend/errors/NotFoundError');
const { limiter } = require('./middlewares/rateLimiter');

const { PORT = 3000 } = process.env;
const { DBADDRESS = 'mongodb://localhost:27017/testdb' } = process.env;
const app = express();

mongoose.connect(DBADDRESS, {
  useNewUrlParser: true,
});
app.use(express.json());
app.use(cookieParser());

app.use(limiter);
app.use(helmet());
app.use(requestLogger);
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000'],
}));

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), signIn);

app.use(require('./middlewares/auth'));

app.post('/signout', signOut);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use(errorLogger);
app.use(() => {
  throw new NotFoundError('404 Страница не найдена');
});
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => { });
