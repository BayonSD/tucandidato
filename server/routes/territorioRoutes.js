const express = require('express');
const router = express.Router();
const territorioController = require('../controllers/territorioController');

router.get('/', territorioControllerController.getAll);
router.get('/:id', territorioController.getById);

module.exports = router;