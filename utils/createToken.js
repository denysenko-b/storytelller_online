const jwt = require('jsonwebtoken');

module.exports = (userData) => jwt.sign(
    userData,
    require('../config/keys').jwt,
    { expiresIn: 36000 }
)