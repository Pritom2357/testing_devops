const express = require('express');
const DemandController = require('../controllers/demandController');

const router = express.Router();

router.post('/', DemandController.create);
router.get('/', DemandController.getAll);

module.exports = router;
