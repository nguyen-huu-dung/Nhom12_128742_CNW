const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentModel = new Schema({
    accountId: {
        type: Schema.Types.ObjectId,
        ref: 'accounts',
        required: true
    },
    musicId: {
        type: Schema.Types.ObjectId,
        ref: 'musics',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Number,
        required: true
    },
    updatedAt: {
        type: Number,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'deleted'],
        default: 'active'
    }
})

module.exports = mongoose.model('comments', CommentModel);