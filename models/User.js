const mongoose = require('mongoose');

const follower = new mongoose.Schema({
    userId: {
        ref: 'users',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    birthday: {
        type: Date
    },

    name: {
        type: String
    },
    surname: {
        type: String
    },
    about: {
        type: String
    },
    urlToImage: {
        type: String
    },

    followers: [
        follower
    ],
    followings: [
        follower
    ],

    addedAt: {
        type: Number,
        default: Date.now()
    }
})

module.exports = mongoose.model('users', userSchema);