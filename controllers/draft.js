const Draft = require('../models/Draft');

const save = (req, res) => {
    const data = { title, body, previewImage, previewBody, previewTitle } = req.body;

    const { _id: userId } = req.user;

    Draft.create({
        ...data,
        userId,
        publishedAt: Date.now()
    })
        .then(() => {
            res.sendStatus(201);
        })
        .catch(() => {
            res.sendStatus(500)
        })
}

const remove = (req, res) => {
    const {id: _id} = req.params;
    
    Draft.findOne({_id}, {_id: true, userId: true})
    .then(draft => {
        const { userId: draftUserId } = draft;
        const {_id: userId} = req.user;

        if (String(draftUserId) == userId) {
            Draft.findByIdAndRemove(_id)
            .then(() => res.sendStatus(200))
            .catch(() => res.sendStatus(500))
        }
        else{
            res.sendStatus(400)
        }
    })
    .catch(() => res.sendStatus(404))
}

const get = (req, res) => {
    const { id: _id } = req.params;

    Draft.findOne({ _id })
        .then(draft => {
            const { userId: draftUserId } = draft;
            const {_id} = req.user;
            

            if (String(draftUserId) == _id) {
                return res.send(draft);
            }
            else {
                return res.sendStatus(400);
            }
        })
        .catch(() => res.sendStatus(404))
}

const getAll = (req, res) => {
    const { _id: userId } = req.user;
    const selection = req.body || {};


    Draft.find({ userId }, selection)
        .then(drafts => res.send(drafts))
        .catch(() => res.sendStatus(404))
}

module.exports = {
    save,
    get,
    remove,
    getAll
}