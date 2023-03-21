const express = require('express');
const controller = require('../controllers/mainController');

const router = express.Router();


// main routes
router.get('/', controller.index);

router.get('/error', controller.error);

router.get('/contact', controller.contact);

router.get('/about', controller.about);

module.exports = router;