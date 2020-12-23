const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const secure = require('../utils/secure');

router.post('/login', authController.login);
router.post('/reg', authController.reg);
router.post('/auth', secure, authController.auth);

module.exports = router;