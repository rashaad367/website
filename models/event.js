const { DateTime } = require('luxon');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: [true, 'title is required'] },
    category: {
        type: String, required: [true, 'category is required'],
        enum: ['hackathon', 'meetup', 'project session', 'mini bootcamp', 'party', 'other']
    },
    hostName: { type: String, required: [true, 'host name is required'] },
    startDate: { type: Date, required: [true, 'start date is required'] },
    endDate: { type: Date, required: [true, 'end date is required'] },
    details: { type: String, required: [true, 'details are required'] },
    location: { type: String, required: [true, 'location is required'] },
    image: { type: String, required: [true, 'image is required'] }
},
    { timestamps: true }
);

//collection name is events in the database
module.exports = mongoose.model('Event', eventSchema);
