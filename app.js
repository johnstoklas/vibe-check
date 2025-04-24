// requires
const express = require('express');
const app = express();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Vibe Check Documentation',
        version: '1.0.0',
        description: 'Documentation for my Node.js + Express backend',
      },
      tags: [
        {
            name: 'Main Page',
            description: 'This is the page you arrive at when going to the website'
        },
        {
          name: 'Game',
          description: 'Endpoints related to game logic and play',
        },
        {
          name: 'Characters',
          description: 'Endpoints related to character data',
        },
        {
          name: 'Profile',
          description: 'User profile endpoints',
        },
        {
            name: 'Leaderboard',
            description: 'Leaderboard endpoints',
          },
        ]
    },
    apis: ['./architecture/routes/*.js'],

};

const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const session = require('express-session');
const store = require('./architecture/database').sessionStore;
const expressWs = require('express-ws')(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// session app usage
app.use(
    session({
        key: 'session_cookie_name',
        secret: 'session_cookie_secret',
        store: store,
        resave: false,
        saveUninitialized: false
    })
);

// Web Sockets port
app.listen(8080);

// routers and URL routes
const profileRouter = require('./architecture/routes/profile');
const characterRouter = require('./architecture/routes/character');
const scoresRouter = require('./architecture/routes/scores');
const indexRouter = require('./architecture/routes/index');
const gameRouter = require('./architecture/routes/game');

app.use('/', profileRouter);
app.use('/characters', characterRouter);
app.use('/leaderboard', scoresRouter);
app.use('/', indexRouter);
app.use('/game', gameRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(status).json({
        error: message
    });
});
module.exports = app;
