const Genre = require('../models/Genre');

const get = (req, res) => Genre.findById(req.params.id).then(genre => res.send(genre)).catch(() => res.sendStatus(404));

const getAll = (req, res) => Genre.find({}).then(genres => res.send(genres)).catch(() => res.sendStatus(500));

module.exports = {
    get,
    getAll
}