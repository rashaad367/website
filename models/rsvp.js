const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { check } = require('express-validator');

const rsvpSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', required: [true, 'There must be a user.']
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event', required: [true, 'There must be an event.']
    },
    status: {
        type: String,
        enum: ['YES', 'NO', 'MAYBE'],
        required: [true, 'Must choose a valid status.'],
    }
}, { timestamps: true });

module.exports = mongoose.model('Rsvp', rsvpSchema);
