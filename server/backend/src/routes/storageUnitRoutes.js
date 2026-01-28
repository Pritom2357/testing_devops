const express = require('express');
const StorageUnitController = require('../controllers/storageUnitController');

const router = express.Router();

router.post('/', StorageUnitController.create);
router.get('/', StorageUnitController.getAll);

module.exports = router;
