const mongoose = require('mongoose');
const { Schema } = mongoose;

const TokenSchema = new Schema({
    accountId: {
        type: Schema.Types.ObjectId,
        ref: "accounts",
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    },
    updatedAt: {
        type: String,
        default: null
    },
    status: {
        type: String, 
        enum: [ "active", "deleted" ],
        default: "active",
        required: true
    }
})

module.exports = mongoose.model('tokens', TokenSchema);