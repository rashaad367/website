const model = require('../models/user');
const Event = require('../models/event');
const rsvp = require('../models/rsvp');

exports.new = (req, res) => {
    res.render('./user/new');
};

exports.create = (req, res, next) => {

    let user = new model(req.body);
    if (user.email) {
        user.email = user.email.toLowerCase();
    }
    user.save()
        .then(user => {
            req.flash('success', 'Successfully created account!');
            res.redirect('/users/login');
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                return res.redirect('/users/new');
            }

            if (err.code === 11000) {
                req.flash('error', 'Email has been used!');
                return res.redirect('/users/new');
            }

            next(err);
        });


};

exports.getUserLogin = (req, res, next) => {

    return res.render('./user/login');

}

exports.login = (req, res, next) => {

    let email = req.body.email;
    let password = req.body.password;
    if (email) {
        email = email.toLowerCase();
    }
    model.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email address!');
                res.redirect('/users/login');
            } else {
                user.comparePassword(password)
                    .then(result => {
                        if (result) {
                            req.session.user = user._id;
                            req.session.name = user.firstName;
                            req.flash('success', 'You have successfully logged in!');
                            res.redirect('/');
                        } else {
                            req.flash('error', 'Invalid password!');
                            res.redirect('/users/login');
                        }
                    });
            }
        })
        .catch(err => next(err));

};

exports.profile = (req, res, next) => {
    let id = req.session.user;
    Promise.all([model.findById(id), Event.find({ hostName: id }), rsvp.find({ user: id }).populate('event')])
        .then(results => {
            const [user, events, rsvps] = results;
            res.render('./user/profile', { user, events, rsvps });
        })
        .catch(err => next(err));
};


exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err)
            return next(err);
        else
            res.redirect('/');
    });

};