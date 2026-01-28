const express = require('express');
const RouteController = require('../controllers/routeController');

const router = express.Router();

router.post('/', RouteController.create);
router.get('/', RouteController.getAll);

module.exports = router;
