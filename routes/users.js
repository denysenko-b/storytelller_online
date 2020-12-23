const express = require('express');
const router = express.Router();
const {
    find,
    get,
    update,
    updatePassword,
    updateUsername,
    follow,
    unfollow,
    getSmallData,
    getById,
    checkEmail
} = require('../controllers/user');

const secure = require('../utils/secure');

router.patch('/', secure, update);
router.patch('/updatePassword', secure, updatePassword);
// router.patch('/updateUsername', secure, updateUsername);
router.post('/get', getSmallData);
router.post('/check-email/:email', checkEmail);

router.post('/follow/:id', secure, follow);
router.delete('/follow/:id', secure, unfollow);

router.post('/find', find);
router.post('/getById/:id', getById);
router.post('/:id', get);

module.exports = router;