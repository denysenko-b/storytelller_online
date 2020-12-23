const express = require('express');
const router = express.Router();
const {get, getAll} = require('../controllers/genres');

router.get('/', getAll);
router.get('/:id', get);

module.exports = router;