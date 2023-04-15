// require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const eventRoutes = require('./routes/eventRoutes');
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
const { fileUpload } = require('./middleware/fileUpload');

// create app
const app = express();

// configure app
const passwd = encodeURIComponent("vwG1QQnmCYmWCZT3");
let port = 3000;
let host = 'localhost';
let url = "mongodb+srv://rjone177:" + passwd + "@cluster0.mc0b5ro.mongodb.net/project3?retryWrites=true&w=majority";
app.set('view engine', 'ejs');

//connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(port, host, () => {
            console.log('Server is running on port', port);
        });
    })
    .catch(err => console.log(err.message));

// mount middleware
app.use(
    session({
        secret: "afj2o93f09j09ajf902j0s",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongoUrl: url }),
        cookie: { maxAge: 60 * 60 * 1000 }
    })
);
app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.user = req.session.user || null;
    res.locals.name = req.session.name;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// routes
app.use('/events', eventRoutes);
app.use('/', mainRoutes);
app.use('/users', userRoutes);

// multer (file upload) for events page

// page not found & error handling
app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (!err.status) {
        console.log(err.stack);
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('error', { error: err });
});

