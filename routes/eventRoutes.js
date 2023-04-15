const express = require('express');
const { fileUpload } = require('../middleware/fileUpload');
const controller = require('../controllers/eventController');
const { isLoggedIn, isHost } = require('../middleware/auth');

const router = express.Router();

// GET /events: send all events to the user
router.get('/', controller.index);

// GET /events/new: send html form for creating a new event
router.get('/new', isLoggedIn, controller.new);

// POST /events: create a new event
router.post('/', fileUpload, isLoggedIn, controller.create);

// GET /events/:id: send details of event identified by id
router.get('/:id', controller.show);

// GET /events/:id/edit: send html form for editing an existing event
router.get('/:id/edit', isLoggedIn, isHost, controller.edit);

// PUT /events/:id: update the event identified by id
router.put('/:id', fileUpload, isLoggedIn, isHost, controller.update);

// DELETE /events/:id: delete the event identified by id
router.delete('/:id', isLoggedIn, isHost, controller.delete);

module.exports = router;