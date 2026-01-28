const express = require('express');
const LocationController = require('../controllers/locationController');

const router = express.Router();

router.post('/', LocationController.create);
router.get('/', LocationController.getAll);

module.exports = router;
