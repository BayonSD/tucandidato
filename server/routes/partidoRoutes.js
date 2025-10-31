const express = require('express');
const router = express.Router();
const partidoController = require('../controllers/partidoController');

router.get('/', partidoController.getAll);
router.get('/:id', partidoController.getById);

module.exports = router;