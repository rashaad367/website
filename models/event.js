const { DateTime } = require('luxon');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: [true, 'title is required'] },
    category: {
        type: String, required: [true, 'author is required'],
        enum: ['meetup', 'workshop']
    },
    hostName: { type: String, required: [true, 'host name is required'] },
    startDate: { type: Date, reqruied: [true, 'start date is requried'] },
    endDate: { type: Date, required: [true, 'end date is requried'] },
    details: { type: String, required: [true, 'details are required'] },
    location: { type: String, required: [true, 'location is required'] },
    image: { type: String, required: [true, 'image is required'] }
},
    { timestamps: true }
);

//collection name is events in the database
module.exports = mongoose.model('Event', eventSchema);

/*const events = [
    {
        id: '1',
        title: 'Hackathon',
        category: 'meetup',
        hostName: 'Rashaad',
        details: 'This is a hackathon.',
        location: 'Corner street 1234', //try local instead of now
        startDate: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
        endDate: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
        image: '/images/hangout-image.png'
    },
    {
        id: '2',
        title: 'Code party',
        category: 'meetup',
        hostName: 'Joan',
        details: 'Join our code party and have fun!',
        location: 'Johnson Way 1234',
        startDate: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
        endDate: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
        image: '/images/hangout-image.png'
    },
    {
        id: '3',
        title: 'Hangout',
        category: 'meetup',
        hostName: 'Price',
        details: 'Hangout with us and enjoy talking about coding ventures.',
        location: 'Wallis Rd 1234',
        startDate: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
        endDate: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
        image: '/images/hangout-image.png'
    },
    {
        id: '4',
        title: 'Conventional project session',
        category: 'workshop',
        hostName: 'Johnathon',
        details: 'This is a project session deticated to heping people learn more about APIs',
        location: 'Woodward 103',
        startDate: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
        endDate: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
        image: '/images/hangout-image.png'
    },
    {
        id: '5',
        title: 'Indie game development',
        category: 'workshop',
        hostName: 'Jennifer',
        details: 'This event is catered toward making cool games.',
        location: 'Songway 1234',
        startDate: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
        endDate: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
        image: '/images/hangout-image.png'
    },
    {
        id: '6',
        title: 'Mini code bootcamps',
        category: 'workshop',
        hostName: 'Gwen',
        details: 'Little code bootcamps that last a week and help people learn code.',
        location: 'Woodward 108',
        startDate: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
        endDate: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
        image: '/images/hangout-image.png'
    }
];

exports.find = function () {
    return events;
};

exports.findById = function (id) {
    return events.find(event => event.id === id);
};

exports.save = function (event) {
    event.id = uuidv4();
    events.push(event);
}

exports.updateById = function (id, newEvent) {
    let event = events.find(event => event.id === id);
    if (event) {
        event.title = newEvent.title;
        event.category = newEvent.category;
        event.details = newEvent.details;
        event.location = newEvent.location;
        event.startDate = newEvent.startDate;
        event.endDate = newEvent.endDate;
        event.hostName = newEvent.hostName;
        event.image = newEvent.image;
        return true;
    } else {
        return false;
    }
}

exports.deleteById = function (id) {
    let index = events.findIndex(event => event.id === id);
    if (index !== -1) {
        events.splice(index, 1);
        return true;
    } else {
        return false;
    }
}*/