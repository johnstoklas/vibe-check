// requires
const express = require('express');
const app = express();

const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const session = require('express-session');
const store = require('./other/database').sessionStore;

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

// routers and URL routes
const profileRouter = require('./architecture/routes/profile');
const characterRouter = require('./architecture/routes/character');
const scoresRouter = require('./architecture/routes/scores');
const indexRouter = require('./architecture/routes/index');

app.use('/', profileRouter);
app.use('/api', characterRouter);
app.use('/', scoresRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res) => {
    
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
