const {hashSync, genSaltSync, compareSync} = require('bcryptjs');

module.exports = {
    create: (password, securityLevel=10) => hashSync(password, genSaltSync(securityLevel)),
    compare: (fPassword, sPassoword) => compareSync(fPassword, sPassoword)
};