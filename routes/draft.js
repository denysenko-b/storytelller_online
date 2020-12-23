const express = require('express');
const router = express.Router();
const {save, remove, get, getAll} = require('../controllers/draft');

const secure = require('../utils/secure');

router.post('/', secure, save);
router.post('/find', secure, getAll);
router.delete('/:id', secure, remove);
router.get('/:id', secure, get);

module.exports = router;