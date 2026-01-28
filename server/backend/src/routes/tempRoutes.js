const express = require('express');
const ValidationController = require('../controllers/validationController');

const router = express.Router();

router.post('/validate', ValidationController.validateTemperature);

module.exports = router;
