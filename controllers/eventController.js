const multer = require('multer');
const { DateTime } = require('luxon');
const model = require('../models/event');
const rsvp = require('../models/rsvp');

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
    event.hostName = req.session.user;

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
        const startDateTime = new Date(req.body.startDate).toISOString();
        const endDateTime = new Date(req.body.endDate).toISOString();
        event.startDate = startDateTime;
        event.endDate = endDateTime;
    }
    event.save()
        .then(event => {
            req.flash('success', 'Event was created successfully!');
            res.redirect('/events');
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            next(err);
        });
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id!');
        err.status = 400;
        return next(err);
    }
    model.findById(id).populate('hostName', 'firstName lastName')
        .then(event => {
            // find all of rsvps that relate to current event
            rsvp.countDocuments({ event: event, status: "YES" })
                .then(count => {
                    // use a count variable to check current rsvp status for Yes's 
                    if (event) {
                        res.render('./event/show', { event, count }); // pass count into ejs page
                    } else {
                        let err = new Error('Cannot find a event with id ' + id);
                        err.status = 404;
                        next(err);
                    }
                })
                .catch(err => next(err));

        })
        .catch(err => next(err));

};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id!');
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
                req.flash('error', err.message);
                return res.redirect('back');
            }
            next(err);
        });
};

exports.update = (req, res, next) => {
    let event = req.body;
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id!');
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
    const startDateTime = new Date(req.body.startDate).toISOString();
    const endDateTime = new Date(req.body.endDate).toISOString();
    event.startDate = startDateTime;
    event.endDate = endDateTime;
    model.findByIdAndUpdate(id, event, { useFindAndModify: false, runValidators: true })
        .then(event => {
            if (event) {
                req.flash('success', 'Event was updated successfully!');
                res.redirect('/events');
            } else {
                let err = new Error('Cannot find a event with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            next(err);
        });
};

exports.delete = (req, res, next) => {
    let eventId = req.params.id;
    if (!eventId.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id!');
        err.status = 400;
        return next(err);
    }

    model.findByIdAndDelete(eventId, { useFindAndModify: false })
        .then(event => {
            if (event) {
                rsvp.deleteMany({ event: eventId })
                    .then(() => {
                        req.flash('success', 'Event was deleted successfully!');
                        res.redirect('/events');
                    })
                    .catch(err => next(err));

            } else {
                let err = new Error('Cannot find a event with id ' + eventId);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

exports.rsvp = (req, res, next) => {
    let eventId = req.params.id;
    let userId = req.session.user;
    let status = req.body.status;

    if (['YES', 'NO', 'MAYBE'].includes(status)) {
        model.findById(eventId)
            .then(event => {
                if (event) {
                    rsvp.findOneAndUpdate(
                        { event: eventId, user: userId },
                        { status: status },
                        { upsert: true, new: true }
                    )
                        .then(() => {
                            req.flash('success', 'RSVP has been set successfully!');
                            res.redirect('back');
                        })
                        .catch(err => next(err));

                } else {
                    let err = new Error('Cannot find a event with id ' + eventId);
                    err.status = 404;
                    next(err);
                }
            })
            .catch(err => next(err));
    } else {
        req.flash('error', 'This is an invalid RSVP status!');
        res.redirect('back');
    }
}