const multer = require('multer');
const { DateTime } = require('luxon');
const model = require('../models/event');

exports.index = (req, res, next) => {
    model.find()
        .then(events => res.render('./event/index', { events }))
        .catch(err => next(err));
};

exports.new = (req, res) => {
    res.render('./event/new');
};

exports.create = (req, res, next) => {
    let event = new model(req.body);
    // if file is not choosen then image is null and error pops up from schema
    let image;
    if (!req.file) {
        image = null;
    } else {
        image = "/images/" + req.file.filename;
    }
    // image path
    event.image = image;
    // format date if user selects a date otherwise dates are left as null
    if (req.body.startDate && req.body.endDate) {
        const startDateTime = DateTime.fromJSDate(new Date(event.startDate)).toISO();
        const endDateTime = DateTime.fromJSDate(new Date(event.endDate)).toISO();
        event.startDate = startDateTime;
        event.endDate = endDateTime;
    }
    event.save()
        .then(event => res.redirect('/events'))
        .catch(err => {
            if (err.name === 'ValidationError') {
                err.status = 400;
                return next(err);
            }
            next(err);
        });
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        return next(err);
    }
    model.findById(id)
        .then(event => {
            if (event) {
                res.render('./event/show', { event });
            } else {
                let err = new Error('Cannot find a event with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        return next(err);
    }

    model.findById(id)
        .then(event => {
            if (event) {
                res.render('./event/edit', { event });
            } else {
                let err = new Error('Cannot find a event with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                err.status = 400;
            }
            next(err);
        });
};

exports.update = (req, res, next) => {
    let event = req.body;
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        return next(err);
    }
    // if file is not choosen then image is null and error pops up from schema
    let image;
    if (!req.file) {
        image = null;
    } else {
        image = "/images/" + req.file.filename;
    }

    // image path
    event.image = image;

    // format date
    const startDateTime = DateTime.fromJSDate(new Date(event.startDate)).toISO();
    const endDateTime = DateTime.fromJSDate(new Date(event.endDate)).toISO();
    event.startDate = startDateTime;
    event.endDate = endDateTime;
    model.findByIdAndUpdate(id, event, { useFindAndModify: false, runValidators: true })
        .then(event => {
            if (event) {
                res.redirect('/events');
            } else {
                let err = new Error('Cannot find a event with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                err.status = 400;
                return next(err);
            }
            next(err);
        });
};

exports.delete = (req, res, next) => {
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        return next(err);
    }

    model.findByIdAndDelete(id, { useFindAndModify: false })
        .then(event => {
            if (event) {
                res.redirect('/events');
            } else {
                let err = new Error('Cannot find a event with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};