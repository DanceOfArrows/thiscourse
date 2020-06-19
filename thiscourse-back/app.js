const cookieParser = require('cookie-parser');
const cors = require('cors')
const express = require('express');
const logger = require('morgan');
const path = require('path');

const { environment } = require("./config");
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const forumsRouter = require('./routes/forums');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: true }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', forumsRouter);

app.use((req, res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.errors = ["The requested resource couldn't be found."];
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500);
    const isProduction = environment === "production";
    res.json({
        title: err.title || "Server Error",
        errors: err.errors,
        stack: isProduction ? null : err.stack,
    });
});

module.exports = app;
