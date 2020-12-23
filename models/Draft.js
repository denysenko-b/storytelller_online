const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema({
    title: {
        type: String
    },
    body: {
        type: Array
    },
    publishedAt: {
        type: Number,
        default: Date.now()
    },
    userId: {
        ref: 'users',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    genres: [{
        ref: 'genres',
        type: mongoose.Schema.Types.String,
    }],

    previewImage: {
        type: String
    },
    previewTitle: {
        type: String
    },
    previewBody: {
        type: String
    }
})

module.exports = mongoose.model('drafts', draftSchema);