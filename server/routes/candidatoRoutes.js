const express = require('express');
const router = express.Router();
const candidatoController = require('../controllers/candidatoController');

router.get('/', candidatoController.getAll);
router.get('/:id', candidatoController.getById);

module.exports = router;