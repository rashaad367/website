const Event = require('../models/event');

// Checks if user is a guest
exports.isGuest = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
};

// Checks if user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
    }
};

// Check if user is host of a event
exports.isHost = (req, res, next) => {
    let id = req.params.id;

    Event.findById(id)
        .then(event => {
            if (event) {
                if (event.hostName == req.session.user) {
                    return next();
                } else {
                    let err = new Error('Unauthorized to access the resource');
                    err.status = 401;
                    return next(err);
                }
            } else {
                let err = new Error('Cannot find a event with id ' + id);
                err.status = 404;
                return next(err);
            }
        })
        .catch(err => next(err));
};

// Check if user is host of a event
exports.isHost = (req, res, next) => {
    let id = req.params.id;

    Event.findById(id)
        .then(event => {
            if (event) {
                if (event.hostName == req.session.user) {
                    return next();
                } else {
                    let err = new Error('Unauthorized to access the resource');
                    err.status = 401;
                    return next(err);
                }
            } else {
                let err = new Error('Cannot find a event with id ' + id);
                err.status = 404;
                return next(err);
            }
        })
        .catch(err => next(err));
};

// Check if user is not the host of a event
exports.isNotHost = (req, res, next) => {
    let id = req.params.id;

    Event.findById(id)
        .then(event => {
            if (event) {
                if (event.hostName == req.session.user) {
                    let err = new Error('Unauthorized to access the resource');
                    err.status = 401;
                    return next(err);
                } else {
                    return next();
                }
            } else {
                let err = new Error('Cannot find a event with id ' + id);
                err.status = 404;
                return next(err);
            }
        })
        .catch(err => next(err));
};