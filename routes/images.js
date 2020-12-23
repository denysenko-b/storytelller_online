const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

router.use(express.static('uploads'));

router.get('/:name', (req, res) => {
    res.render(req.params.name);
})

router.post('/', upload, (req, res) => {
    const filedata = req.file;

    if (filedata) {
        res.send(filedata.filename);
    }
    else {
        res.sendStatus(400);
    }
});

module.exports = router;