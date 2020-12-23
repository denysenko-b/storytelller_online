const Story = require('../models//Story');

const get = (req, res) => Story.findById(req.params.id)
    .then(story => {
        const views = story.views + 1;
        story.updateOne({
            views
        })
            .catch(err => console.log(err))

        res.send(story);
    })
    .catch(() => res.sendStatus(404))

const getSmallData = ({ body: { id, selection, find = {} } }, res) => Story.findOne({ _id: id, ...find }, selection)
    .then(storyData => {
        res.send(storyData);
    })
    .catch(() => {
        res.sendStatus(404);
    })

const find = ({ body }, res) => {
    const { skip = 0, limit = 20, selection = {}, find = {}, where, sort = { publishedAt: -1 } } = body;

    let defaultQuery = Story.find(find, selection);

    if (where) {
        const { key, value } = where;

        defaultQuery = defaultQuery.where(key).in(value);
    }

    defaultQuery
        .sort(
            sort
        )
        .skip(
            Number(skip)
        ).limit(
            Number(limit)
        ).then(stories => {
            res.send(stories);
        })
        .catch(() => res.sendStatus(404))
}

const add = (req, res) => {
    const {
        title,
        body,
        genres,

        previewImage = '',
        previewBody,
        previewTitle
    } = req.body;

    Story.create({
        title,
        body,
        genres,
        userId: req.user.id,
        previewImage,
        previewBody,
        previewTitle
    })
        .then(story => res.send(story._id))
        .catch(() => res.sendStatus(400))
}

const update = (req, res) => Story.findById(req.body.storyId)
    .then(story => {
        if (story.userId == req.user.id) {
            delete req.body.storyId;
            delete req.body.likes;
            delete req.body.comments;
            delete req.body.publishedAt;
            delete req.body.views;
            delete req.body.userId;

            story.updateOne(
                req.body
            )
                .then(() => res.sendStatus(204))
                .catch(err => res.sendStatus(500))
        } else {
            res.sendStatus(401)
        }
    })
    .catch(() => res.sendStatus(404))

const deleteStory = (req, res) => Story.findById(req.params.storyId)
    .then(story => {
        if (story.userId == req.user.id) {
            story.remove()
                .then(() => res.sendStatus(200))
                .catch(err => res.sendStatus(500))
        } else {
            res.sendStatus(401)
        }
    })
    .catch(() => res.sendStatus(404))

const addComment = (req, res) => Story.findById(req.body.storyId)
    .then(story => story.updateOne({
        $push: {
            comments: {
                body: req.body.body,
                userId: req.user.id
            }
        }
    })
        .then(() => res.sendStatus(201))
        .catch(() => res.sendStatus(500)))
    .catch(() => res.sendStatus(404));

const deleteComment = (req, res) => Story.findById(req.body.storyId)
    .then(story => story.updateOne({
        $pull: {
            comments: {
                _id: req.body.commentId
            }
        }
    })
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500)))
    .catch(() => res.sendStatus(404));

const updateComment = (req, res) => Story.updateOne({
    _id: req.body.storyId,
    "comments._id": req.body.commentId
}, {
    $set: {
        "comments.$.body": req.body.body
    }
})
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(404))

const like = async (req, res) => {
    const isLike = await Story.findOne({
        _id: req.params.id,
        "likes.userId": req.user.id
    }).catch(() => { })
    if (isLike) {
        res.sendStatus(400);
    } else {
        Story.updateOne({
            _id: req.params.id
        }, {
            $push: {
                likes: {
                    userId: req.user.id
                }
            }
        })
            .then(() => {
                res.sendStatus(200);
            })
            .catch(() => res.sendStatus(404))
    }
}

const unlike = (req, res) => Story.findById(req.params.id)
    .then(story => story.updateOne({
        $pull: {
            likes: {
                userId: req.user.id
            }
        }
    })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(() => res.sendStatus(500))
    )
    .catch(() => res.sendStatus(404));

const commentLike = async (req, res) => {
    Story.updateOne({
        _id: req.body.storyId,
        "comments._id": req.body.commentId
    }, {
        $push: {
            "comments.$.likes": {
                userId: req.user.id
            }
        }
    })
        .then(() => res.sendStatus(201))
        .catch(() => res.sendStatus(404))
}

const commentUnlike = (req, res) => Story.updateOne({
    _id: req.body.storyId,
    "comments._id": req.body.commentId
}, {
    $pull: {
        "comments.$.likes": {
            userId: req.user.id
        }
    }
})
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(404))

const findOne = ({ query }, res) => {
    if (!query.id) {
        res.sendStatus(400);
    }
    else {
        const { id: _id } = query;
        delete query.id;

        console.log(query);

        Story.findOne({
            _id
        }, query)
            .then(storyData => {
                res.send(storyData);
            })
            .catch(err => res.sendStatus(404))
    }
}

module.exports = {
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
}