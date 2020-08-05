var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 라우팅 설정
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var moviesRouter = require('./routes/movies.js');
var contentRouter = require('./routes/contents.js');


var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 라우팅 설정
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/contents', contentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



const { sequelize } = require('./models/index.js');

const driver = () => {
    sequelize.sync().then(() => {
        console.log('초기화 완료.');
    }).catch((err) => {
        console.error('초기화 실패');
        console.error(err);
    });
};
driver();


module.exports = app;