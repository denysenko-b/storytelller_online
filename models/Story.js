const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    userId: {
        ref: 'users',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const commentSchema = new mongoose.Schema({
    userId: {
        ref: 'users',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    likes: [
        likeSchema
    ],
    publishedAt: {
        type: Number,
        default: Date.now()
    }
})

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: Array,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [
        likeSchema
    ],
    comments: [
        commentSchema
    ],
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
        required: true
    }],

    
    previewImage: {
        type: String
    },
    previewTitle: {
        type: String,
        required: true
    },
    previewBody: {
        type: String
    }
})

module.exports = mongoose.model('stories', storySchema);