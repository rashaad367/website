// require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const eventRoutes = require('./routes/eventRoutes');
const mainRoutes = require('./routes/mainRoutes');
const { fileUpload } = require('./middleware/fileUpload');

// create app
const app = express();

// configure app
let port = 3000;
let host = 'localhost';
let url = "mongodb+srv://rjone177:vwG1QQnmCYmWCZT3@cluster0.mc0b5ro.mongodb.net/?retryWrites=true&w=majority";
app.set('view engine', 'ejs');

//connect to MongoDB
mongoose.connect(url)
    .then(() => {
        //start the server
        app.listen(port, host, () => {
            console.log('Server is running on port', port);
        });
    })
    .catch(err => console.log(err.message));

// mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// routes
app.use('/events', eventRoutes);
app.use('/', mainRoutes);

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

