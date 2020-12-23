const User = require('../models/User');
const Password = require('../utils/password');
const createToken = require('../utils/createToken');

const get = (req, res) => {
    User.findOne({ username: req.params.id }, req.body)
        .then(user => {
            delete user._doc.password;
            res.send(user._doc);
        })
        .catch(err => res.sendStatus(404));
}


const getById = (req, res) => {
    User.findOne({ _id: req.params.id }, req.body)
        .then(user => {
            delete user._doc.password;
            res.send(user._doc);
        })
        .catch(err => res.sendStatus(404));
}

const getSmallData = ({ body: { id, selection } }, res) => User.findOne({ username: id }, selection)
    .then(storyData => {
        res.send(storyData);
    })
    .catch(() => {
        res.sendStatus(404);
    })

const find = (req, res) => {
    const { find, selection, skip = 0, limit = 40, sort } = req.body;

    User.find(find,
        {
            ...selection,
            password: false,
            followings: false,
            about: false
        })
        .sort(sort || {
            addedAt: -1
        })
        .skip(skip)
        .limit(limit)
        .then(users => {
            res.send(users);
        })
        .catch(() => {
            res.sendStatus(404)
        });
}


const update = (req, res) => {
    delete req.body.password;

    User.findByIdAndUpdate(req.user.id, req.body)
        .then(() => res
            .sendStatus(200))
        .catch(() => res.sendStatus(409))
}

const updatePassword = async (req, res) => {
    const {
        id
    } = req.user;
    const {
        oldPassword,
        newPassword
    } = req.body;

    const user = await User.findById(id);

    if (Password.compare(oldPassword, user.password)) {
        User.findByIdAndUpdate(id, {
            password: Password.create(newPassword)
        })
            .then(() => res.sendStatus(200))
            .catch(() => res.sendStatus(500))
    } else {
        res.sendStatus(403);
    }
}

const updateUsername = async (req, res) => {
    const {
        id
    } = req.user;
    const {
        username
    } = req.body;

    const token = createToken({
        id,
        username
    })
    User.findByIdAndUpdate(id, {
        username
    })
        .then(() => res.send({
            token: `Bearer ${token}`
        }))
        .catch(() => res.sendStatus(500))
}

const updateEmail = (req, res) => {
    // todo learn nodemail gmail
}

const verifyEmail = (req, res) => {
    // todo learn nodemail gmail
}

const checkEmail = (req, res) => {
    User.findOne({ email: req.params.email }, req.body)
        .then(user => {
            delete user._doc.password;
            res.send(user._doc);
        })
        .catch(err => res.sendStatus(404));
}

// const __f_a = (req, res, action, list) => User.updateOne({
//     _id: 
// }, {
//     [`$${action}`]: {
//         list: {
//             userId: 
//         }
//     }
// })

const follow = async (req, res) => {
    if (req.params.id == req.user.id) {
        res.sendStatus(400);
    } else {
        const user = await User.findOne({
            _id: req.params.id
        }).catch(() => { });

        const isFollow = await User.findOne({
            _id: req.params.id,
            "followers.userId": req.user.id
        }).catch(() => { });

        if (isFollow) {
            res.sendStatus(400);
        } else {
            if (user) {
                User.updateOne({
                    _id: req.params.id
                }, {
                    $push: {
                        followers: {
                            userId: req.user.id
                        }
                    }
                })
                    .catch(() => { });
                User.updateOne({
                    _id: req.user.id
                }, {
                    $push: {
                        followings: {
                            userId: req.params.id
                        }
                    }
                })
                    .catch(() => { });
                res.sendStatus(200);
            }
            else {
                res.sendStatus(400);
            }
        }
    }
}

const unfollow = (req, res) => {
    User.updateOne({
        _id: req.params.id
    }, {
        $pull: {
            followers: {
                userId: req.user.id
            }
        }
    })
        .catch(() => { });
    User.updateOne({
        _id: req.user.id
    }, {
        $pull: {
            followings: {
                userId: req.params.id
            }
        }
    })
        .catch(() => { });

    res.sendStatus(200);
}

module.exports = {
    get,
    find,
    update,
    updatePassword,
    updateUsername,

    follow,
    unfollow,
    getSmallData,
    getById,

    checkEmail
}