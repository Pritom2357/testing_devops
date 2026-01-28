const express = require('express');
const ValidationController = require('../controllers/validationController');

const router = express.Router();

router.post('/validate', ValidationController.validateNetwork);

module.exports = router;
