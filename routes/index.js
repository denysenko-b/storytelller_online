const express = require('express');
const router = express.Router();

const passport = require('passport');

router.use('/', require('./auth'));
router.use('/users', require('./users'));
router.use('/genres', require('./genres'));
router.use('/stories', require('./stories'));
router.use('/images', require('./images'));
router.use('/drafts', require('./draft'));

module.exports = router;