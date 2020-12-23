const express = require('express');
const router = express.Router();
const {
    get,
    find,
    add,
    update,
    deleteStory,
    addComment,
    deleteComment,
    updateComment,
    like,
    unlike,
    commentLike,
    commentUnlike,
    findOne,
    getSmallData
} = require('../controllers/stories');

const secure = require('../utils/secure');

router.post('/', secure, add);
router.patch('/', secure, update);

router.post('/comment', secure, addComment);
router.delete('/comment', secure, deleteComment);
router.patch('/comment', secure, updateComment);

router.post('/comment/like', secure, commentLike);
router.delete('/comment/like', secure, commentUnlike);

router.post('/like/:id', secure, like);
router.delete('/like/:id', secure, unlike);

router.delete('/:storyId', secure, deleteStory);

router.post('/find', find);
router.post('/find-one', getSmallData);
router.get('/find-one?', findOne)
router.get('/:id', get);

module.exports = router;