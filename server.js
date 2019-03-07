'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');
const bodyParser = require('body-parser');
const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const questionsRouter = require('./routes/questions');

const app = express();
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(bodyParser.json());

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

// Protect endpoints using JWT Strategy
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

// Mount routers
app.use('/auth/users', usersRouter);
app.use('/auth/login', authRouter);
app.use('/api/questions', jwtAuth, questionsRouter);


function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
} 

module.exports = { app };
