const { body } = require('express-validator');
const { validationResult } = require('express-validator');
const { DateTime } = require('luxon');

exports.validateSignUp = [body('firstName', 'First name cannot be empty!').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty!').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address!').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters!').isLength({ min: 8, max: 64 }).trim()];

exports.validateLogin = [body('email', 'Email must be a valid email address!').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters!').isLength({ min: 8, max: 64 }).trim()];

const eventCategories = ['hackathon', 'meetup', 'project session', 'mini bootcamp', 'party', 'other'];
exports.validateEvent = [body('category', 'Category must be a valid category!').isIn(eventCategories).trim().escape(),
body('title', 'Title cannot be empty!').notEmpty().trim().escape(),
body('details', 'Details cannot be empty!').notEmpty().trim().escape(),
body('location', 'Location cannot be empty!').notEmpty().trim().escape(),
body('startDate', 'Must be a valid ISO 8601 date!').isISO8601().trim().escape(),
body('startDate', 'Start date must be after today!').isAfter(DateTime.now().endOf('day').toISO()),
body('endDate', 'Must be a valid ISO 8601 date!').isISO8601().trim().escape(),
body('endDate', 'End date must be after the start date!').custom((value, { req }) => {
    if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after the start date!');
    }

    return true;
}),
    //body('image', 'Image cannot be empty!').notEmpty()
]

const rsvps = ['YES', 'NO', 'MAYBE'];
exports.validateRsvp = [body('status', 'The status of the RSVP can only be "Yes", "No", or "Maybe"!').isIn(rsvps).notEmpty().trim().escape()]

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
}