const User = require('../models/User');
const Password = require('../utils/password');

const login = async (req, res) => {
    const {
        username,
        password
    } = req.body;

    const user = await User.findOne({
        username
    });

    if (user) {
        if (Password.compare(password, user.password)) {
            const token = require('../utils/createToken')({
                id: user.id
            })

            const json = user._doc;

            delete json.password;
            delete json.id;
            delete json._v;
            res.send({
                token: `Bearer ${token}`,
                ...json
            })
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(404);
    }
}

const reg = (req, res) => {
    if (req.body.username.match(/^[A-Za-z0-9_]{4,16}$/)) {
        User.create({
            ...req.body,
            password: Password.create(req.body.password)
        })
            .then(user => {
                const token = require('../utils/createToken')({
                    id: user.id
                })

                const json = user._doc;

                delete json.password;
                delete json.id;
                delete json._v;
                res.send({
                    token: `Bearer ${token}`,
                    ...json
                })
            })
            .catch(err => res.sendStatus(409));
    }
    else {
        res.sendStatus(400);
    }
}

const auth = ({ user: { id } }, res) => {

    User.findOne({
        _id: id
    }, {
        password: false,
        followers: false,
        followings: false,
        addedAt: false
    })
        .then(userData => res.send(userData))
        .catch(() => res.sendStatus(400))
}

module.exports = {
    login,
    reg,

    auth
}