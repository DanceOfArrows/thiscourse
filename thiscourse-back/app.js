const cookieParser = require('cookie-parser');
const cors = require('cors')
const express = require('express');
const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');

const { environment } = require("./config");
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');


const app = express();

app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.raw({
    limit: '10mb'
}));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', categoriesRouter);

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
