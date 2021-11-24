require('dotenv').config();

const {
  NODE_ENV,
  MONGO_URL,
  JWT_SECRET,
} = process.env;

module.exports = {
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'sercretDevelopKey',
  MONGO_URL: NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/moviesdb',
};
